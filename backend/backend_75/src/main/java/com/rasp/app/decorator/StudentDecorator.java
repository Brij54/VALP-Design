package com.rasp.app.decorator;

import com.rasp.app.controller.MetaDataController;
import com.rasp.app.helper.BatchHelper;
import com.rasp.app.helper.StudentHelper;
import com.rasp.app.resource.Batch;
import com.rasp.app.resource.MetaDataDto;
import com.rasp.app.resource.Student;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import platform.db.Expression;
import platform.db.REL_OP;
import platform.db.ResourceMetaData;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.util.ExceptionSeverity;
import platform.util.Field;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

public class StudentDecorator extends BaseDecorator {
    public StudentDecorator() {
        super(new Student());
    }

    @Override
    public BaseResource[] getQuery(ServletContext ctx, String queryId, Map<String, Object> map, BaseService service) throws ApplicationException{
        ArrayList<BaseResource> list = new ArrayList<>();
        if("GET_NAME_BY_BATCH".equalsIgnoreCase(queryId)){
            String batchId = (String) map.get(Student.FIELD_BATCH);

            if(batchId != null){
                BaseResource[] r= BatchHelper.getInstance().getByExpression(
                        new Expression(Batch.FIELD_ID, REL_OP.EQ,batchId)
                );
                if(r != null) Collections.addAll(list,r);
            }
            return list.toArray(new BaseResource[0]);
        }
        if ("CHECK_VALP_ELIGIBILITY".equalsIgnoreCase(queryId)) {

            String rollNo = (String) map.get(Student.FIELD_ROLL_NO);
            if (rollNo == null || rollNo.trim().isEmpty()) {
                return new BaseResource[0];
            }

            // 1) all student entries for this roll number
            BaseResource[] sr = StudentHelper.getInstance().getByExpression(
                    new Expression(Student.FIELD_ROLL_NO, REL_OP.EQ, rollNo)
            );
            if (sr == null || sr.length == 0) {
                // no records → clearly not eligible
                return new BaseResource[0];
            }

            // cast to Student
            List<Student> students = new ArrayList<>();
            for (BaseResource br : sr) {
                students.add((Student) br);
            }

            // 2) count courses done
            // if you only want approved ones:
            long coursesDone = students.stream()
                    .filter(s -> Boolean.TRUE.equals(s.getStatus()))
                    .count();

            // (or: long coursesDone = students.size(); to count all)

            if (coursesDone == 0) {
                return new BaseResource[0];
            }

            // 3) get batch info (all records should share same batch)
            Student first = students.get(0);
            String batchId = first.getBatch();
            if (batchId == null) {
                return new BaseResource[0];
            }

            Batch batch = (Batch) BatchHelper.getInstance().getById(batchId);
            if (batch == null || batch.getNo_of_courses() == null) {
                return new BaseResource[0];
            }

            long required = batch.getNo_of_courses();

            // 4) final check
            if (coursesDone >= required) {
                // Eligible → we just return the student records (non-empty)
                return sr;
            } else {
                // Not eligible → empty
                return new BaseResource[0];
            }
        }

        if ("GENERATE_VALP_CERTIFICATE".equalsIgnoreCase(queryId)) {
            String rollNo = (String) map.get(Student.FIELD_ROLL_NO);
            if (rollNo == null || rollNo.trim().isEmpty()) {
                throw new ApplicationException(ExceptionSeverity.ERROR, "Roll number is required");
            }

            try {
                // Generate PDF as bytes
                byte[] pdfBytes = generateValpCertificate(ctx, rollNo.trim());

                // Build a lightweight BaseResource response
                BaseResource fileRes = new BaseResource() {
                    @Override
                    public void convertMapToResource(Map<String, Object> map) {}
                    @Override
                    public void convertTypeUnsafeMapToResource(Map<String, Object> map) {}
                    @Override
                    public void convertPrimaryMapToResource(Map<String, Object> map) {}
                    @Override
                    public void convertTypeUnsafePrimaryMapToResource(Map<String, Object> map) {}

                    @Override
                    public String getCluster() { return "rasp_db"; }

                    @Override
                    public String getClusterType() { return "replica"; }

                    @Override
                    public platform.db.ResourceMetaData getMetaData() {
                        try {
                            MetaDataController controller = new MetaDataController();
                            List<MetaDataDto> metaList = controller.processMetadata("ValpCertificate");

                            if (metaList == null || metaList.isEmpty()) {
                                System.err.println("⚠️ No metadata found for ValpCertificate");
                                return fallbackMeta();
                            }

                            MetaDataDto dto = metaList.get(0);
                            String resourceName = dto.getResource();
                            if (resourceName == null || resourceName.trim().isEmpty()) {
                                System.err.println("⚠️ Resource name is missing in MetaDataDto");
                                return fallbackMeta();
                            }

                            ResourceMetaData meta = new ResourceMetaData(resourceName);
                            meta.setCluster("rasp_db");
                            meta.setClusterType("replica");

                            for (Map<String, Object> field : dto.getFieldValues()) {
                                String name = (String) field.get("name");
                                String type = (String) field.get("type");

                                if (name != null && type != null) {
                                    try {
                                        Field fieldObj = new Field();
                                        fieldObj.setName(name);
                                        fieldObj.setType(type);
                                        meta.addField(fieldObj); // ✅ Correct usage with Field object
                                    } catch (Exception e) {
                                        System.err.println("⚠️ Failed to add field " + name + ": " + e.getMessage());
                                    }
                                }
                            }


                            return meta;
                        } catch (Exception e) {
                            e.printStackTrace();
                            return fallbackMeta();
                        }
                    }

                    private ResourceMetaData fallbackMeta() {
                        ResourceMetaData meta = new ResourceMetaData("ValpCertificate");
                        meta.setCluster("rasp_db");
                        meta.setClusterType("replica");
                        return meta;
                    }
                };

                Map<String, Object> mapRes = new HashMap<>();
                mapRes.put("fileName", "VALP_Certificate_" + rollNo + ".pdf");
                mapRes.put("fileData", Base64.getEncoder().encodeToString(pdfBytes));
                mapRes.put("contentType", "application/pdf");

                fileRes.convertMapToResource(mapRes);

                return new BaseResource[]{fileRes};

            } catch (IOException e) {
                throw new ApplicationException(ExceptionSeverity.ERROR,
                        "Failed to generate certificate: " + e.getMessage());
            }
        }

        return super.getQuery(ctx,queryId,map,service);
    }

    private byte[] generateValpCertificate(ServletContext ctx, String rollNo)
            throws IOException, ApplicationException {

        BaseResource[] records = StudentHelper.getInstance()
                .getByExpression(new Expression(Student.FIELD_ROLL_NO, REL_OP.EQ, rollNo));

        if (records == null || records.length == 0) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "No student records found for roll no " + rollNo);
        }

        List<Student> approved = Arrays.stream(records)
                .map(r -> (Student) r)
                .filter(s -> Boolean.TRUE.equals(s.getStatus()))
                .collect(Collectors.toList());

        if (approved.isEmpty()) {
            throw new ApplicationException(ExceptionSeverity.ERROR, "No approved certificates for roll no " + rollNo);
        }

        Student first = approved.get(0);
        String studentName = Optional.ofNullable(first.getName()).orElse("Student");
        String rollNumber = first.getRoll_no();

        try (InputStream template = getClass().getClassLoader()
                .getResourceAsStream("templates/certificate_format.pdf")) {

            if (template == null)
                throw new ApplicationException(ExceptionSeverity.ERROR, "Certificate template not found in classpath");

            try (PDDocument document = PDDocument.load(template);
                 ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

                PDPage page = document.getPage(0);
                PDPageContentStream cs = new PDPageContentStream(document, page,
                        PDPageContentStream.AppendMode.APPEND, true, true);

                // Student name + roll number
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 14);
                cs.newLineAtOffset(140, 470);
                cs.showText(studentName + " (" + rollNumber + ")");
                cs.endText();

                // Table of approved courses
                float startY = 355;
                float rowHeight = 18;
                float xSNo = 85;
                float xCourse = 150;
                float xDate = 470;

                cs.setFont(PDType1Font.HELVETICA, 12);

                int index = 1;
                for (Student s : approved) {
                    float y = startY - (index - 1) * rowHeight;

                    cs.beginText();
                    cs.newLineAtOffset(xSNo, y);
                    cs.showText(index + ".");
                    cs.endText();

                    cs.beginText();
                    cs.newLineAtOffset(xCourse, y);
                    cs.showText(s.getCourse_name());
                    cs.endText();

                    cs.beginText();
                    cs.newLineAtOffset(xDate, y);
                    cs.showText(s.getCourse_completion_date());
                    cs.endText();

                    index++;
                }

                cs.close();
                document.save(baos);
                return baos.toByteArray();
            }
        }
    }

}
