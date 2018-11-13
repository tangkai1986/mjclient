#-*- coding:utf-8 -*-
import re
import os
import shutil
import json
import hashlib
import urllib;
def isNum(s):
    try:
        nb = int(s)  #将字符串转换成数字成功则返回True
        return True
    except ValueError as e:
        return False  #如果出现异常则返回False


reg = r'.+?#(.+?)#'
sheetre = re.compile(reg)

dirreg = r'\\(\w)'
dirre = re.compile(dirreg)

segIntreg = r'.+?#(.+?):.+?:int'
segIntre = re.compile(segIntreg,re.S)

segStringreg = r'.+?#(.+?):.+?:string'
segStringre = re.compile(segStringreg,re.S)

filereg = r'\W'
filere = re.compile(filereg)

replaceCfgfilename="replaceCfg.json";


def checkFileName(filename):
    retlist = re.findall(filere,filename)
    if len(retlist) > 0:
        # print (filename)
        print (u'非法字符')
        return False
    return True


def getSLsheetName(sheetName):
    imglist = re.findall(sheetre,sheetName)
    if len(imglist) > 0 :
        return imglist[0]
    return ""

def getSheetBySheetCfgName(bk,sheetName):
    for sheet in bk.sheets():
        imglist = re.findall(sheetre,sheet.name)
        if len(imglist) > 0 :
            if imglist[0] == sheetName :
                return sheet

    return None


def checkUsedSegment(segment):
    isString = not isNum(segment)
    if not isString:
        return False,"",""

    imglist = re.findall(segIntre,segment)
    if len(imglist) > 0 :
        if imglist[0] != "none":
            return True,imglist[0],"int"


    imglist = re.findall(segStringre,segment)
    if len(imglist) > 0 :
        if imglist[0] != "none":
            return True,imglist[0],"string"

    return  False,"",""



def getFileNameWithoutExt(filename):
    (filepath,tempfilename) = os.path.split(filename);
    (shortname,extension) = os.path.splitext(tempfilename);
    return shortname

def getSheetByName(bk,sheetName):
    for sheet in bk.sheets():
        sheetCfgName = getSLsheetName(sheet.name)
        if sheetCfgName == sheetName:
            return sheet
    return None

def getLastPartName(_dir):
    p,f=os.path.split(_dir);
    return f

def getFilePath(fullfilename):
    (filepath,tempfilename) = os.path.split(fullfilename);
    return filepath,tempfilename

zhPattern = re.compile(u'[\u4e00-\u9fa5]+')

def findChinese(vaildLine):
    match = zhPattern.search(vaildLine)
    return match

def getFileList(dir,childDir, fileList,ignor_dirs):
    currentDir = dir
    if childDir :
        currentDir = os.path.join(dir,childDir)

    if os.path.isfile(currentDir):
        (filepath,tempfilename) = os.path.split(currentDir);
        (shortname,extension) = os.path.splitext(tempfilename);
        fileList.append(currentDir)
    elif os.path.isdir(currentDir):
        shortPath = getFileNameWithoutExt(currentDir)
        if shortPath in ignor_dirs:
            #print ("ignor_dir : " + currentDir)
            return

        for s in os.listdir(currentDir):
            if childDir :
                childDir2 = os.path.join(childDir,s)
            else:
                childDir2 = s

            getFileList(dir,childDir2,fileList,ignor_dirs)
    else:
        print ("dir error :" , currentDir)

    return fileList


def getFileListandDirs(currentDir):

    files = {}
    dirs = {}
    for item in os.listdir(currentDir):
        full_path = os.path.join(currentDir,item)
        if os.path.isfile(full_path):
            files[item] = item
        elif os.path.isdir(full_path):
            dirs[item] = item

    return files,dirs

def getFileType( fileList,ext):
    retList = []
    for item in fileList:
        (filepath,tempfilename) = os.path.split(item);
        (shortname,extension) = os.path.splitext(tempfilename);
        if extension != ext:
            continue
        retList.append(item)

    return retList

def getFileType( fileList,ext):
    retList = []
    for item in fileList:
        (filepath,tempfilename) = os.path.split(item);
        (shortname,extension) = os.path.splitext(tempfilename);
        if extension != ext:
            continue
        retList.append(item)

    return retList

def getFileExceptBlackList( fileList,blackList):
    retList = []
    for item in fileList:
        (filepath,tempfilename) = os.path.split(item);
        (shortname,extension) = os.path.splitext(tempfilename);
        if shortname in blackList:
            continue
        retList.append(item)

    return retList


def checkFileNameInList(fileList):
    retList = []
    for item in fileList:
        (filepath,tempfilename) = os.path.split(item);
        (shortname,extension) = os.path.splitext(tempfilename);
        if not checkFileName(shortname):
            print(item)
            continue
        retList.append(item)

    return retList

def getSheetTitleList(sheet,titleList,type_list):
    for i in range(0,sheet.ncols):
        segment = sheet.cell_value(0,i)
        (bUsed,name,_type) = checkUsedSegment(segment)
        titleList.append(name)
        type_list.append(_type)
    return

def saveDicToJson(dic,fileName):
    #先读取本地化配置文件
    data=json.dumps(dic, sort_keys=True, indent=4, ensure_ascii=False);
    openlogTxt=open(fileName,'w');
    openlogTxt.writelines(data)
    return True

def saveList(list,fileName):
    #先读取本地化配置文件
    data=json.dumps(list);
    openlogTxt=open(fileName,'w');
    openlogTxt.writelines(data)
    return True

def backToPath(target_dir):
    curDir = os.getcwd()
    if not (target_dir in curDir):
        return False
    dir = getLastPartName(curDir)
    if dir == target_dir:
        return True
    os.chdir("..")
    return backToPath(target_dir)

def getLanguageDics(sheet,listofDic):
    #获取各行数据
    emptyList = []
    nrows = sheet.nrows
    for i in range(1,nrows):
        target_key = sheet.cell_value(i,0)
        if target_key == '':
            continue
        if target_key in listofDic[0].keys():
            print (u'multy define key, ' , target_key)
            return False

        safeTag = True
        for j in range(0,len(listofDic)):

            item = sheet.cell_value(i,j + 1)
            if item == None or item == '':
                safeTag = False

            isString = not isNum(item)
            if isString :
                listofDic[j][target_key] = item
            else:
                listofDic[j][target_key] = str(int(item))
        if not safeTag:
            emptyList.insert(len(emptyList),sheet.cell_value(i,0))
    if len(emptyList) > 0 :
        print(u'不完整翻译：')
        print(emptyList)

    saveList(emptyList,"uncomplateTranslate.txt")
    return True

def mkdirs(dir):
    if not os.path.exists(dir):
        os.makedirs(dir)

#大文件的MD5值
def getFileMd5Value(filename):
    if not os.path.isfile(filename):
        return
    myhash = hashlib.md5()
    f = open(filename,'rb')
    while True:
        b = f.read(8096)
        if not b :
            break
        myhash.update(b)
    f.close()
    return myhash.hexdigest()


def coverCopyDir(sourceDir,targetDir):
    if os.path.isfile(sourceDir):
        print ('file')
    elif os.path.isdir(sourceDir):
        for s in os.listdir(sourceDir):
             temp1 = os.path.join(sourceDir,s)
             temp2 = os.path.join(targetDir,s)
             # print (temp1,temp2)
             if os.path.isfile(temp1):
                 shutil.copy(temp1,temp2)
             elif os.path.isdir(temp1):
                 if not os.path.exists(temp2):
                    os.makedirs(temp2)
                 coverCopyDir(temp1,temp2)
             else:
                 print ('else ',s)
    else:
        print ('dir type error',sourceDir)

def deleteCopyDir(sourceDir,targetDir):

    if not os.path.exists(sourceDir):
        print (u'目录不存在')
        return False
    else:
        if os.path.exists(targetDir):
             shutil.rmtree(targetDir)
        shutil.copytree(sourceDir,targetDir)
        print (u'目录存在')
        return True


def checkSegmentTypeInt(segment):
    (iUsed,name,_type) = checkUsedSegment(segment)
    if not iUsed:
        return 0

    if _type == 'int':
        return 1
    return  2

def getFilesInList(fileList,checkFileList):
    retList = []
    for item in fileList:
        shortName = getFileNameWithoutExt(item)
        if shortName in checkFileList:
            retList.append(item)

    return retList


def sheetToList(sheet):
    if sheet == None:
        return [[]]
    data = []
    for i in range(0,sheet.nrows):
        row_data = []
        for j in range(0,sheet.ncols):
            item =  sheet.cell_value(i,j)
            isString =  not isNum(item)
            if isString :
                if item == None:
                    item = ""
            else:
                item = str(int(item))
            row_data.append(item)
        data.append(row_data)

    return data

def ListEceptInvalid(sheet,sourceDataList):
    if sheet == None:
        return sourceDataList
    data = []

    usedIndexList = []
    for j in range(0,sheet.ncols):
        item =  sheet.cell_value(0,j)
        (usedTag,segmentName,_type) = checkUsedSegment(item)
        if usedTag:
            usedIndexList.append(j)


    for i in range(0,len(sourceDataList)):
        row_data = []
        for j in usedIndexList:
            item =  sourceDataList[i][j]
            isString =  not isNum(item)
            if isString :
                if item == None:
                    item = ""
            else:
                item = str(int(item))
            row_data.append(item)
        data.append(row_data)
    return data

def getSegmentIndex(sheet,replaceClosList):
    closlist = []
    for i in range(0,len(replaceClosList)):
        targetSegmentName = replaceClosList[i]
        findTag = False

        for j in range(0,sheet.ncols):
            item =  sheet.cell_value(0,j)
            (usedTag,segmentName,_type) = checkUsedSegment(item)
            if usedTag and segmentName == targetSegmentName:
                closlist.append(j)
                findTag = True
                break

        if not findTag:
            closlist.append(-1)
    print(closlist)
    return closlist

def getLanguageId():
    langfile=file("res/lang_conf.json");
    langstr=langfile.read();
    langsetting=json.loads(langstr);
    #先读取本地化配置文件
    filename="res/localsetting.json";
    lfile=open(filename,'r');
    lstr = lfile.read();
    lfile.close()

    localsetting = json.loads(lstr);

    return langsetting[localsetting["lang_id"]]['lang_dir'];

def getFSDataTag():

    #先读取本地化配置文件
    filename="res/localsetting.json";
    lfile=open(filename,'r');
    lstr = lfile.read();
    lfile.close()

    localsetting = json.loads(lstr);
    return localsetting["fs_data_tag"];

def updateLanguageConfig():

    Rootdir = os.getcwd()
    lanrootdir = str(getLanguageId())

    fullSourceDir = os.path.join(Rootdir,"lan")
    fullSourceDir = os.path.join(fullSourceDir,lanrootdir)
    coverCopyDir(fullSourceDir,Rootdir)

    dataDir = os.path.join(Rootdir,"lan\\src\\" + getFSDataTag() + "\\" + lanrootdir)
    coverCopyDir(dataDir,Rootdir + "\\src\\ExcelData")

    print(u"本地化   拷贝完成   ")

def getReplaceConfig():
    try:
        lfile=open(replaceCfgfilename,'r');
        lstr = lfile.read();
        lfile.close()
        localsetting = json.loads(lstr);
        return localsetting
    except ValueError as e:
        print(u"源文件错误" + replaceCfgfilename)
        return None


def readFileData(filename):
    lfile=open(filename,'r');
    lstr = lfile.read();
    lfile.close()

    return lstr

def readLine(filename):
    lfile=open(filename,'r');
    lines = lfile.readlines();
    lfile.close()

    return lines

def checkInReplaceCfg(shortName,sheetCfgName,replaceCfg ):
    if shortName in replaceCfg.keys():
        replaceSheetList = replaceCfg[shortName]
        for replaceSheet in replaceSheetList:
            if replaceSheet[0] == sheetCfgName:
                return True
    return False

def replaceClos(fileName,sheetCfgName,replaceIndexList, dataList,replaceDic):

    if len(replaceIndexList) <= 0:
        return
    if len(dataList) <= 0:
        return
    print("fileName ",fileName, len(dataList),len(dataList[0]))
    for i in range(0,len(replaceIndexList)):
        clo = replaceIndexList[i]
        if clo < 0:
            print(u"error :file  ;" + fileName + ", segment config index:",i+1)
            return
        for j in range(1,len(dataList)):
            key = dataList[j][clo]

            if  findChinese(key) :
                print(u"chinese key")
                print(u"file name  ",fileName)
                print(u"sheet name ",sheetCfgName)
                print(u"configIndex",i)
                # return False

            if  isNum(key) :
                print(u"number key")
                print(u"file name  ",fileName)
                print(u"sheet name ",sheetCfgName)
                print(u"configIndex",i)
                # return False

            if key != '':
                if not ( key in replaceDic.keys()):
                    print(u" not define key",key)
                dataList[j][clo] = replaceDic[key]


def getSegmentIndexAbsulute(sheet,setmentName):
    return 40