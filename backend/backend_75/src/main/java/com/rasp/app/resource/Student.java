/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.rasp.app.resource;

import com.fasterxml.jackson.annotation.JsonIgnore;
import platform.exception.ExceptionEnum;
 import platform.resource.BaseResource;
import platform.util.*;
import org.springframework.stereotype.Component;
import platform.db.*;
import java.util.*;
import com.rasp.app.message.*;
import com.rasp.app.helper.*;
import com.rasp.app.service.*;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
@Component
 public class Student extends BaseResource {
	private String id = null;
	private String g_created_by_id = null;
	private String g_created_by_name = null;
	private String g_modified_by_id = null;
	private String g_modified_by_name = null;
	private Long g_creation_time = null;
	private Long g_modify_time = null;
	private String g_soft_delete = null;
	private String g_status = null;
	private String archived = null;
	private Long archived_time = null;
	private String roll_no = null;
	private String email = null;
	private String course_name = null;
	private String course_url = null;
	private String course_duration = null;
	private String platform = null;
	private String course_completion_date = null;
	private String upload_certificate = null;
	private String batch = null;
	private String course_mode = null;
	private Boolean status = null;
	private String user_id = null;
	private Map<String, Object> extra_data = null;

	public static String FIELD_ID = "id";
	public static String FIELD_G_CREATED_BY_ID = "g_created_by_id";
	public static String FIELD_G_CREATED_BY_NAME = "g_created_by_name";
	public static String FIELD_G_MODIFIED_BY_ID = "g_modified_by_id";
	public static String FIELD_G_MODIFIED_BY_NAME = "g_modified_by_name";
	public static String FIELD_G_CREATION_TIME = "g_creation_time";
	public static String FIELD_G_MODIFY_TIME = "g_modify_time";
	public static String FIELD_G_SOFT_DELETE = "g_soft_delete";
	public static String FIELD_G_STATUS = "g_status";
	public static String FIELD_ARCHIVED = "archived";
	public static String FIELD_ARCHIVED_TIME = "archived_time";
	public static String FIELD_ROLL_NO = "roll_no";
	public static String FIELD_EMAIL = "email";
	public static String FIELD_COURSE_NAME = "course_name";
	public static String FIELD_COURSE_URL = "course_url";
	public static String FIELD_COURSE_DURATION = "course_duration";
	public static String FIELD_PLATFORM = "platform";
	public static String FIELD_COURSE_COMPLETION_DATE = "course_completion_date";
	public static String FIELD_UPLOAD_CERTIFICATE = "upload_certificate";
	public static String FIELD_BATCH = "batch";
	public static String FIELD_COURSE_MODE = "course_mode";
	public static String FIELD_STATUS = "status";
	public static String FIELD_USER_ID = "user_id";
	public static String FIELD_EXTRA_DATA = "extra_data";

	private static final long serialVersionUID = 1L;
	public final static ResourceMetaData metaData = new ResourceMetaData("student");

	static {
		metaData.setCheckBeforeAdd(false);
		metaData.setCheckBeforeUpdate(false);

		metaData.setAllow_duplicate_name(false);
		Field idField = new Field("id", "String");
		idField.setRequired(true);
		metaData.addField(idField);

		Field g_created_by_idField = new Field("g_created_by_id", "String");
		g_created_by_idField.setLength(128);
		metaData.addField(g_created_by_idField);

		Field g_created_by_nameField = new Field("g_created_by_name", "String");
		g_created_by_nameField.setLength(128);
		metaData.addField(g_created_by_nameField);

		Field g_modified_by_idField = new Field("g_modified_by_id", "String");
		g_modified_by_idField.setLength(128);
		metaData.addField(g_modified_by_idField);

		Field g_modified_by_nameField = new Field("g_modified_by_name", "String");
		g_modified_by_nameField.setLength(128);
		metaData.addField(g_modified_by_nameField);

		Field g_creation_timeField = new Field("g_creation_time", "long");
		metaData.addField(g_creation_timeField);

		Field g_modify_timeField = new Field("g_modify_time", "long");
		metaData.addField(g_modify_timeField);

		Field g_soft_deleteField = new Field("g_soft_delete", "String");
		g_soft_deleteField.setDefaultValue("N");
		g_soft_deleteField.setLength(1);
		metaData.addField(g_soft_deleteField);

		Field g_statusField = new Field("g_status", "String");
		g_statusField.setIndexed(true);
		g_statusField.setLength(32);
		metaData.addField(g_statusField);

		Field archivedField = new Field("archived", "String");
		archivedField.setIndexed(true);
		archivedField.setDefaultValue("N");
		archivedField.setLength(1);
		metaData.addField(archivedField);

		Field archived_timeField = new Field("archived_time", "long");
		metaData.addField(archived_timeField);

		Field roll_noField = new Field("roll_no", "String");
		roll_noField.setRequired(true);
		metaData.addField(roll_noField);

		Field emailField = new Field("email", "String");
		emailField.setRequired(true);
		metaData.addField(emailField);

		Field course_nameField = new Field("course_name", "String");
		course_nameField.setRequired(true);
		metaData.addField(course_nameField);

		Field course_urlField = new Field("course_url", "String");
		metaData.addField(course_urlField);

		Field course_durationField = new Field("course_duration", "String");
		course_durationField.setRequired(true);
		metaData.addField(course_durationField);

		Field platformField = new Field("platform", "String");
		platformField.setRequired(true);
		metaData.addField(platformField);

		Field course_completion_dateField = new Field("course_completion_date", "String");
		course_completion_dateField.setRequired(true);
		metaData.addField(course_completion_dateField);

		Field upload_certificateField = new Field("upload_certificate", "String");
		upload_certificateField.setFile(true);
		upload_certificateField.setRequired(true);
		metaData.addField(upload_certificateField);

		Field batchField = new Field("batch", "String");
		batchField.setRequired(true);
		batchField.setForeign(new Foreign("Batch"));
		metaData.addField(batchField);

		Field course_modeField = new Field("course_mode", "String");
		course_modeField.setEnum(true);
		course_modeField.setPossible_value("Course_mode");
		course_modeField.setRequired(true);
		metaData.addField(course_modeField);

		Field statusField = new Field("status", "Boolean");
		metaData.addField(statusField);

		Field user_idField = new Field("user_id", "String");
		user_idField.setRequired(true);
		user_idField.setForeign(new Foreign("Users"));
		metaData.addField(user_idField);

		Field extra_dataField = new Field("extra_data", "Map");
		extra_dataField.setValueType("Object");
		metaData.addField(extra_dataField);


		metaData.setTableName("student");

		metaData.setCluster("rasp_db");
	}

	public Student() {this.setId(Util.getUniqueId());}
	public Student(String id) {this.setId(id);}

	public Student(Student obj) {
		this.id = obj.id;
		this.g_created_by_id = obj.g_created_by_id;
		this.g_created_by_name = obj.g_created_by_name;
		this.g_modified_by_id = obj.g_modified_by_id;
		this.g_modified_by_name = obj.g_modified_by_name;
		this.g_creation_time = obj.g_creation_time;
		this.g_modify_time = obj.g_modify_time;
		this.g_soft_delete = obj.g_soft_delete;
		this.g_status = obj.g_status;
		this.archived = obj.archived;
		this.archived_time = obj.archived_time;
		this.roll_no = obj.roll_no;
		this.email = obj.email;
		this.course_name = obj.course_name;
		this.course_url = obj.course_url;
		this.course_duration = obj.course_duration;
		this.platform = obj.platform;
		this.course_completion_date = obj.course_completion_date;
		this.upload_certificate = obj.upload_certificate;
		this.batch = obj.batch;
		this.course_mode = obj.course_mode;
		this.status = obj.status;
		this.user_id = obj.user_id;
		this.extra_data = obj.extra_data;
	}

	public ResourceMetaData getMetaData() {
		return metaData;
	}

	private void setDefaultValues() {
		if(g_soft_delete == null)
			g_soft_delete = "N";
		if(archived == null)
			archived = "N";
	}

	public Map<String, Object> convertResourceToMap(HashMap<String, Object> map) {
		if(id != null)
			map.put("id", id);
		if(g_created_by_id != null)
			map.put("g_created_by_id", g_created_by_id);
		if(g_created_by_name != null)
			map.put("g_created_by_name", g_created_by_name);
		if(g_modified_by_id != null)
			map.put("g_modified_by_id", g_modified_by_id);
		if(g_modified_by_name != null)
			map.put("g_modified_by_name", g_modified_by_name);
		if(g_creation_time != null)
			map.put("g_creation_time", g_creation_time);
		if(g_modify_time != null)
			map.put("g_modify_time", g_modify_time);
		if(g_soft_delete != null)
			map.put("g_soft_delete", g_soft_delete);
		if(g_status != null)
			map.put("g_status", g_status);
		if(archived != null)
			map.put("archived", archived);
		if(archived_time != null)
			map.put("archived_time", archived_time);
		if(roll_no != null)
			map.put("roll_no", roll_no);
		if(email != null)
			map.put("email", email);
		if(course_name != null)
			map.put("course_name", course_name);
		if(course_url != null)
			map.put("course_url", course_url);
		if(course_duration != null)
			map.put("course_duration", course_duration);
		if(platform != null)
			map.put("platform", platform);
		if(course_completion_date != null)
			map.put("course_completion_date", course_completion_date);
		if(upload_certificate != null)
			map.put("upload_certificate", upload_certificate);
		if(batch != null)
			map.put("batch", batch);
		if(course_mode != null)
			map.put("course_mode", course_mode);
		if(status != null)
			map.put("status", status);
		if(user_id != null)
			map.put("user_id", user_id);
		if(extra_data != null)
			map.put("extra_data", extra_data);
		return map;
	}

	public Map<String, Object> validateAndConvertResourceToMap(HashMap<String,Object> map,boolean add) throws ApplicationException {
		if(validateId(add))
			map.put("id", id);
		if(g_created_by_id != null)
			map.put("g_created_by_id", g_created_by_id);
		if(g_created_by_name != null)
			map.put("g_created_by_name", g_created_by_name);
		if(g_modified_by_id != null)
			map.put("g_modified_by_id", g_modified_by_id);
		if(g_modified_by_name != null)
			map.put("g_modified_by_name", g_modified_by_name);
		if(g_creation_time != null)
			map.put("g_creation_time", g_creation_time);
		if(g_modify_time != null)
			map.put("g_modify_time", g_modify_time);
		if(g_soft_delete != null)
			map.put("g_soft_delete", g_soft_delete);
		if(g_status != null)
			map.put("g_status", g_status);
		if(archived != null)
			map.put("archived", archived);
		if(archived_time != null)
			map.put("archived_time", archived_time);
		if(validateRoll_no(add))
			map.put("roll_no", roll_no);
		if(validateEmail(add))
			map.put("email", email);
		if(validateCourse_name(add))
			map.put("course_name", course_name);
		if(course_url != null)
			map.put("course_url", course_url);
		if(validateCourse_duration(add))
			map.put("course_duration", course_duration);
		if(validatePlatform(add))
			map.put("platform", platform);
		if(validateCourse_completion_date(add))
			map.put("course_completion_date", course_completion_date);
		if(validateUpload_certificate(add))
			map.put("upload_certificate", upload_certificate);
		if(validateBatch(add))
			map.put("batch", batch);
		if(validateCourse_mode(add))
			map.put("course_mode", course_mode);
		if(status != null)
			map.put("status", status);
		if(validateUser_id(add))
			map.put("user_id", user_id);
		if(extra_data != null)
			map.put("extra_data", extra_data);
		return map;
	}

	public Map<String, Object> convertResourceToPrimaryMap(HashMap<String, Object> map) {
		return map;
	}

	@SuppressWarnings("unchecked")
	public void convertMapToResource(Map<String, Object> map) {
		id = (String) map.get("id");
		g_created_by_id = (String) map.get("g_created_by_id");
		g_created_by_name = (String) map.get("g_created_by_name");
		g_modified_by_id = (String) map.get("g_modified_by_id");
		g_modified_by_name = (String) map.get("g_modified_by_name");
		g_creation_time = (map.get("g_creation_time") == null ? null : ((Number) map.get("g_creation_time")).longValue());
		g_modify_time = (map.get("g_modify_time") == null ? null : ((Number) map.get("g_modify_time")).longValue());
		g_soft_delete = (String) map.get("g_soft_delete");
		g_status = (String) map.get("g_status");
		archived = (String) map.get("archived");
		archived_time = (map.get("archived_time") == null ? null : ((Number) map.get("archived_time")).longValue());
		roll_no = (String) map.get("roll_no");
		email = (String) map.get("email");
		course_name = (String) map.get("course_name");
		course_url = (String) map.get("course_url");
		course_duration = (String) map.get("course_duration");
		platform = (String) map.get("platform");
		course_completion_date = (String) map.get("course_completion_date");
		upload_certificate = (String) map.get("upload_certificate");
		batch = (String) map.get("batch");
		course_mode = (String) map.get("course_mode");
		status = (Boolean) map.get("status");
		user_id = (String) map.get("user_id");
		extra_data = (Map<String, Object>) map.get("extra_data");
	}

	@SuppressWarnings("unchecked")
	public void convertTypeUnsafeMapToResource(Map<String, Object> map) {
		Object idObj = map.get("id");
		if(idObj != null)
			id = idObj.toString();

		Object g_created_by_idObj = map.get("g_created_by_id");
		if(g_created_by_idObj != null)
			g_created_by_id = g_created_by_idObj.toString();

		Object g_created_by_nameObj = map.get("g_created_by_name");
		if(g_created_by_nameObj != null)
			g_created_by_name = g_created_by_nameObj.toString();

		Object g_modified_by_idObj = map.get("g_modified_by_id");
		if(g_modified_by_idObj != null)
			g_modified_by_id = g_modified_by_idObj.toString();

		Object g_modified_by_nameObj = map.get("g_modified_by_name");
		if(g_modified_by_nameObj != null)
			g_modified_by_name = g_modified_by_nameObj.toString();

		Object g_creation_timeObj = map.get("g_creation_time");
		if(g_creation_timeObj != null)
			g_creation_time = new Long(g_creation_timeObj.toString());

		Object g_modify_timeObj = map.get("g_modify_time");
		if(g_modify_timeObj != null)
			g_modify_time = new Long(g_modify_timeObj.toString());

		Object g_soft_deleteObj = map.get("g_soft_delete");
		if(g_soft_deleteObj != null)
			g_soft_delete = g_soft_deleteObj.toString();

		Object g_statusObj = map.get("g_status");
		if(g_statusObj != null)
			g_status = g_statusObj.toString();

		Object archivedObj = map.get("archived");
		if(archivedObj != null)
			archived = archivedObj.toString();

		Object archived_timeObj = map.get("archived_time");
		if(archived_timeObj != null)
			archived_time = new Long(archived_timeObj.toString());

		Object roll_noObj = map.get("roll_no");
		if(roll_noObj != null)
			roll_no = roll_noObj.toString();

		Object emailObj = map.get("email");
		if(emailObj != null)
			email = emailObj.toString();

		Object course_nameObj = map.get("course_name");
		if(course_nameObj != null)
			course_name = course_nameObj.toString();

		Object course_urlObj = map.get("course_url");
		if(course_urlObj != null)
			course_url = course_urlObj.toString();

		Object course_durationObj = map.get("course_duration");
		if(course_durationObj != null)
			course_duration = course_durationObj.toString();

		Object platformObj = map.get("platform");
		if(platformObj != null)
			platform = platformObj.toString();

		Object course_completion_dateObj = map.get("course_completion_date");
		if(course_completion_dateObj != null)
			course_completion_date = course_completion_dateObj.toString();

		Object upload_certificateObj = map.get("upload_certificate");
		if(upload_certificateObj != null)
			upload_certificate = upload_certificateObj.toString();

		Object batchObj = map.get("batch");
		if(batchObj != null)
			batch = batchObj.toString();

		Object course_modeObj = map.get("course_mode");
		if(course_modeObj != null)
			course_mode = course_modeObj.toString();

		Object statusObj = map.get("status");
		if(statusObj != null)
			status = new Boolean(statusObj.toString());

		Object user_idObj = map.get("user_id");
		if(user_idObj != null)
			user_id = user_idObj.toString();

		extra_data = (Map<String, Object>) map.get("extra_data");
	}

	public void convertPrimaryMapToResource(Map<String, Object> map) {
	}

	public void convertTypeUnsafePrimaryMapToResource(Map<String, Object> map) {
	}

	public String getId() {
		return id;
	}

	public String getIdEx() {
		return id != null ? id : "";
	}

	public void setId(String id) {
		this.id = id;
	}

	public void unSetId() {
		this.id = null;
	}

	public boolean validateId(boolean add) throws ApplicationException {
		if(add && id == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[id]");
		return id != null;
	}

	public String getG_created_by_id() {
		return g_created_by_id;
	}

	public String getG_created_by_idEx() {
		return g_created_by_id != null ? g_created_by_id : "";
	}

	public void setG_created_by_id(String g_created_by_id) {
		this.g_created_by_id = g_created_by_id;
	}

	public void unSetG_created_by_id() {
		this.g_created_by_id = null;
	}

	public String getG_created_by_name() {
		return g_created_by_name;
	}

	public String getG_created_by_nameEx() {
		return g_created_by_name != null ? g_created_by_name : "";
	}

	public void setG_created_by_name(String g_created_by_name) {
		this.g_created_by_name = g_created_by_name;
	}

	public void unSetG_created_by_name() {
		this.g_created_by_name = null;
	}

	public String getG_modified_by_id() {
		return g_modified_by_id;
	}

	public String getG_modified_by_idEx() {
		return g_modified_by_id != null ? g_modified_by_id : "";
	}

	public void setG_modified_by_id(String g_modified_by_id) {
		this.g_modified_by_id = g_modified_by_id;
	}

	public void unSetG_modified_by_id() {
		this.g_modified_by_id = null;
	}

	public String getG_modified_by_name() {
		return g_modified_by_name;
	}

	public String getG_modified_by_nameEx() {
		return g_modified_by_name != null ? g_modified_by_name : "";
	}

	public void setG_modified_by_name(String g_modified_by_name) {
		this.g_modified_by_name = g_modified_by_name;
	}

	public void unSetG_modified_by_name() {
		this.g_modified_by_name = null;
	}

	public Long getG_creation_time() {
		return g_creation_time;
	}

	public long getG_creation_timeEx() {
		return g_creation_time != null ? g_creation_time : 0L;
	}

	public void setG_creation_time(long g_creation_time) {
		this.g_creation_time = g_creation_time;
	}

	@JsonIgnore
	public void setG_creation_time(Long g_creation_time) {
		this.g_creation_time = g_creation_time;
	}

	public void unSetG_creation_time() {
		this.g_creation_time = null;
	}

	public Long getG_modify_time() {
		return g_modify_time;
	}

	public long getG_modify_timeEx() {
		return g_modify_time != null ? g_modify_time : 0L;
	}

	public void setG_modify_time(long g_modify_time) {
		this.g_modify_time = g_modify_time;
	}

	@JsonIgnore
	public void setG_modify_time(Long g_modify_time) {
		this.g_modify_time = g_modify_time;
	}

	public void unSetG_modify_time() {
		this.g_modify_time = null;
	}

	public String getG_soft_delete() {
		return g_soft_delete != null ? g_soft_delete : "N";
	}

	public void setG_soft_delete(String g_soft_delete) {
		this.g_soft_delete = g_soft_delete;
	}

	public void unSetG_soft_delete() {
		this.g_soft_delete = "N";
	}

	public String getG_status() {
		return g_status;
	}

	public String getG_statusEx() {
		return g_status != null ? g_status : "";
	}

	public void setG_status(String g_status) {
		this.g_status = g_status;
	}

	public void unSetG_status() {
		this.g_status = null;
	}

	public String getArchived() {
		return archived != null ? archived : "N";
	}

	public void setArchived(String archived) {
		this.archived = archived;
	}

	public void unSetArchived() {
		this.archived = "N";
	}

	public Long getArchived_time() {
		return archived_time;
	}

	public long getArchived_timeEx() {
		return archived_time != null ? archived_time : 0L;
	}

	public void setArchived_time(long archived_time) {
		this.archived_time = archived_time;
	}

	@JsonIgnore
	public void setArchived_time(Long archived_time) {
		this.archived_time = archived_time;
	}

	public void unSetArchived_time() {
		this.archived_time = null;
	}

	public String getRoll_no() {
		return roll_no;
	}

	public String getRoll_noEx() {
		return roll_no != null ? roll_no : "";
	}

	public void setRoll_no(String roll_no) {
		this.roll_no = roll_no;
	}

	public void unSetRoll_no() {
		this.roll_no = null;
	}

	public boolean validateRoll_no(boolean add) throws ApplicationException {
		if(add && roll_no == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[roll_no]");
		return roll_no != null;
	}

	public String getEmail() {
		return email;
	}

	public String getEmailEx() {
		return email != null ? email : "";
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void unSetEmail() {
		this.email = null;
	}

	public boolean validateEmail(boolean add) throws ApplicationException {
		if(add && email == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[email]");
		return email != null;
	}

	public String getCourse_name() {
		return course_name;
	}

	public String getCourse_nameEx() {
		return course_name != null ? course_name : "";
	}

	public void setCourse_name(String course_name) {
		this.course_name = course_name;
	}

	public void unSetCourse_name() {
		this.course_name = null;
	}

	public boolean validateCourse_name(boolean add) throws ApplicationException {
		if(add && course_name == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[course_name]");
		return course_name != null;
	}

	public String getCourse_url() {
		return course_url;
	}

	public String getCourse_urlEx() {
		return course_url != null ? course_url : "";
	}

	public void setCourse_url(String course_url) {
		this.course_url = course_url;
	}

	public void unSetCourse_url() {
		this.course_url = null;
	}

	public String getCourse_duration() {
		return course_duration;
	}

	public String getCourse_durationEx() {
		return course_duration != null ? course_duration : "";
	}

	public void setCourse_duration(String course_duration) {
		this.course_duration = course_duration;
	}

	public void unSetCourse_duration() {
		this.course_duration = null;
	}

	public boolean validateCourse_duration(boolean add) throws ApplicationException {
		if(add && course_duration == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[course_duration]");
		return course_duration != null;
	}

	public String getPlatform() {
		return platform;
	}

	public String getPlatformEx() {
		return platform != null ? platform : "";
	}

	public void setPlatform(String platform) {
		this.platform = platform;
	}

	public void unSetPlatform() {
		this.platform = null;
	}

	public boolean validatePlatform(boolean add) throws ApplicationException {
		if(add && platform == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[platform]");
		return platform != null;
	}

	public String getCourse_completion_date() {
		return course_completion_date;
	}

	public String getCourse_completion_dateEx() {
		return course_completion_date != null ? course_completion_date : "";
	}

	public void setCourse_completion_date(String course_completion_date) {
		this.course_completion_date = course_completion_date;
	}

	public void unSetCourse_completion_date() {
		this.course_completion_date = null;
	}

	public boolean validateCourse_completion_date(boolean add) throws ApplicationException {
		if(add && course_completion_date == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[course_completion_date]");
		return course_completion_date != null;
	}

	public String getUpload_certificate() {
		return upload_certificate;
	}

	public String getUpload_certificateEx() {
		return upload_certificate != null ? upload_certificate : "";
	}

	public void setUpload_certificate(String upload_certificate) {
		this.upload_certificate = upload_certificate;
	}

	public void unSetUpload_certificate() {
		this.upload_certificate = null;
	}

	public boolean validateUpload_certificate(boolean add) throws ApplicationException {
		if(add && upload_certificate == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[upload_certificate]");
		return upload_certificate != null;
	}

	public String getBatch() {
		return batch;
	}

	public String getBatchEx() {
		return batch != null ? batch : "";
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public void unSetBatch() {
		this.batch = null;
	}

	public boolean validateBatch(boolean add) throws ApplicationException {
		if(add && batch == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[batch]");
		return batch != null;
	}

	public String getCourse_mode() {
		return course_mode;
	}

	public String getCourse_modeEx() {
		return course_mode != null ? course_mode : "";
	}

	public void setCourse_mode(String course_mode) {
		this.course_mode = course_mode;
	}

	public void unSetCourse_mode() {
		this.course_mode = null;
	}

	public boolean validateCourse_mode(boolean add) throws ApplicationException {
		if(add && course_mode == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[course_mode]");
		return course_mode != null;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public void unSetStatus() {
		this.status = null;
	}

	public String getUser_id() {
		return user_id;
	}

	public String getUser_idEx() {
		return user_id != null ? user_id : "";
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public void unSetUser_id() {
		this.user_id = null;
	}

	public boolean validateUser_id(boolean add) throws ApplicationException {
		if(add && user_id == null)
			throw new ApplicationException(ExceptionSeverity.ERROR, "Requierd validation Failed[user_id]");
		return user_id != null;
	}

	public Map<String, Object> getExtra_data() {
		return extra_data;
	}

	public Object getExtra_data(String key) {
		return extra_data == null ? null : extra_data.get(key);
	}

	public void setExtra_data(Map<String, Object> extra_data) {
		this.extra_data = extra_data;
	}

	public void setExtra_data(String key, Object value) {
		if(extra_data == null)
			extra_data = new HashMap<String, Object>();
		extra_data.put(key, value);
	}

	public void unSetExtra_data() {
		this.extra_data = null;
	}
	public String getCluster() {
		return "rasp_db";
	}
	public String getClusterType() {
		return "REPLICATED";
	}
	public  Class<?> getResultClass() {return StudentResult.class;};
	public  Class<?> getMessageClass() {return StudentMessage.class;};
	public  Class<?> getHelperClass() {return StudentHelper.class;};
	public  Class<?> getServiceClass() {return StudentService.class;};
}