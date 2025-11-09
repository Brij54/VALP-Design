package com.rasp.app.decorator;

import com.rasp.app.helper.BatchHelper;
import com.rasp.app.helper.StudentHelper;
import com.rasp.app.resource.Batch;
import com.rasp.app.resource.Student;
import platform.db.Expression;
import platform.db.REL_OP;
import platform.decorator.BaseDecorator;
import platform.resource.BaseResource;
import platform.util.ApplicationException;
import platform.webservice.BaseService;
import platform.webservice.ServletContext;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;

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
        
        return super.getQuery(ctx,queryId,map,service);
    }

}
