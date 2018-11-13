# coding=utf-8
import xlrd
import os,os.path
from biplist import *
import time
import tool
import sys
reload(sys)
sys.setdefaultencoding( "utf-8" )
import  xml.dom.minidom 
import json;
import urllib2;
from xml.dom import minidom
def getDic(targetFileName,targetSheetName):
		dir = os.getcwd()
		path = os.path.join(dir,targetFileName)
		verstionDic = {}
		if not os.path.exists(path):
				print (u'not fond target File ,' + path)
				return verstionDic

		bk = xlrd.open_workbook(path)
		sheet = tool.getSheetByName(bk,targetSheetName)
		if sheet == None:
				print (u'not fond target sheet ,' + targetSheetName)
				return verstionDic

		name_list = []
		type_list = []
		tool.getSheetTitleList(sheet,name_list,type_list)

		nrows = sheet.nrows

		#获取各行数据
		for i in range(1,nrows):

				key = sheet.cell_value(i,0)
				config_dic = {}

				for j in range(0,len(name_list)):
						value = name_list[j]
						if value == "" :
								continue

						_type = type_list[j]
						if _type == 'string':
								config_dic[value] = str(sheet.cell_value(i,j))

						if _type == 'int':
								config_dic[value] = int(sheet.cell_value(i,j))
				verstionDic[key]= config_dic
		return verstionDic;