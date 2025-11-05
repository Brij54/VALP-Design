/*
 * Copyright 2010-2020 M16, Inc. All rights reserved.
 * This software and documentation contain valuable trade
 * secrets and proprietary property belonging to M16, Inc.
 * None of this software and documentation may be copied,
 * duplicated or disclosed without the express
 * written permission of M16, Inc.
 */

package com.rasp.app.resource;

import platform.webservice.BasePossibleValue;
import platform.webservice.Enum;

/*
 ********** This is a generated class Don't modify it.Extend this file for additional functionality **********
 * 
 */
public class CourseMode extends BasePossibleValue {
		public static String ID_Offline = "Offline";
		public static String NAME_Offline = "Offline";
		public static String ID_Online = "Online";
		public static String NAME_Online = "Online";
		public CourseMode() {super("COURSE_MODE");}
		protected void populate() {
 			add(new Enum(ID_Offline,NAME_Offline));
 			add(new Enum(ID_Online,NAME_Online));
		}
}