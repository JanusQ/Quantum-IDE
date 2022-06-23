import React, { useState, useEffect } from "react";
// import { getUserInformation } from '../../api/auth'
import { useHistory } from "react-router-dom";
import {
  getDocList,
  addDocAdmin,
  deleteDocAdmin,
  updateDocAdmin,
  getDoc,
} from "../../api/doc";
import { Tree, Button, Modal, Form, Upload, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { isAuth } from "../../helpers/auth";
import { list } from "postcss";
const { TreeNode } = Tree;
// 树形结构转换
const TranListToTree = (doc_list) => {
  const treeDate = [];
  const map = {};
  doc_list.forEach((item) => {
    if (!item.children) {
      item.children = [];
    }
    map[item.doc_id] = item;
  });
  doc_list.forEach((item) => {
    const parent = map[item.parent_doc_id];
    if (parent) {
      parent.children.push(item);
    } else {
      treeDate.push(item);
    }
  });
  return treeDate;
};
const Test = () => {
  const auth = isAuth();
  const [editId, setEditId] = useState(-1);
  const [addForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [parent_doc_id, setparent_doc_id] = useState(0);
  // 获取列表
    let [treeData, setTreeData] = useState([]);
    const getNoticeListFn = async () => {
    const { data } = await getDocList();
    const treedata = TranListToTree(data.doc_list);
    setTreeData((treeData = treedata));
  
  };
  useEffect(() => {
    getNoticeListFn();
  }, []);
  const uploadChange = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };
  useEffect(() => {
    if (!fileList.length) {
      addForm.resetFields(["file"]);
    }
  }, [fileList]);
  const handleOk = () => {
    addForm.validateFields().then(async (value) => {
      console.log(value, 88888);
      const formData = new FormData();
      if (editId === -1) {
        formData.append("doc_content", value.file.file);
        formData.append("doc_title", value.notice_title);
        formData.append("author", auth.username);
        formData.append("parent_doc_id", parent_doc_id);
        await addDocAdmin(formData);
        message.success("上传成功");
        setIsModalVisible(false);
        getNoticeListFn();
        addForm.resetFields();
      } else {
        formData.append("doc_content", value.file.file);
        formData.append("doc_id", editId);
        await updateDocAdmin(formData);
        message.success("修改成功");
        setIsModalVisible(false);
        getNoticeListFn();
        setEditId(-1);
        addForm.resetFields();
      }
      setFileList([]);
    });
     setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const beforeUpload = (file) => {
    return false;
  };
  // 在树形结构内添加元素
  const renderTreeNodes = (data) => {
    // 新增文档
    const addDoc = (id) => {
      setEditId(-1)
      setIsModalVisible(true);
      setparent_doc_id(id);
    }
    // 删除文档
    const delDoc = (item) =>{
      if(item.children.length !==0) return message.success('当前文档下还有其他文档')
      console.log(item);
    	Modal.confirm({
        title: "确认删除？",
        okText: "确认",
        cancelText: "取消",
        onOk: async () => {
          const formData = new FormData();
          formData.append("doc_id", '');
          await deleteDocAdmin(formData);
          message.success("已删除");
          getNoticeListFn();
        },
      });
    }
    // 修改文档
    const editDoc =(id)=>{
      setEditId(1);
    	setEditId(id);
      setIsModalVisible(true);
    }
    let nodeArr = data.map((item) => {
      item.title = (
        <div key={item.doc_id}>
          <Button type="primary">{item.doc_title}</Button>
          <Button type="primary" onClick={() => addDoc(item.doc_id)}>
            新增
          </Button>
          <Button type="primary" onClick={() => editDoc(item.doc_id)}>
            修改
          </Button>
          <Button type="primary" onClick={() => delDoc(item)}>
            删除
          </Button>
        </div>
      );
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.doc_id} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.title} key={item.doc_id} />;
    });
    return nodeArr;
  };
  return (
    <div>
      <Tree
        defaultExpandAll
        blockNode
        showLine
        treeData={treeData}
        defaultSelectedKeys={["0-0-0"]}
      >
        {renderTreeNodes(treeData)}
      </Tree>
      <Modal
        title={editId===-1 ? "添加文档" : "修改文档"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={addForm}>
          <Form.Item name="notice_title">
            <Input
              style={{ display: editId === -1 ? "flex" : "none" }}
              placeholder="请输入文件名称"
            ></Input>
          </Form.Item>
          <Form.Item name="file">
            <Upload
              multiple={false}
              fileList={fileList}
              onChange={uploadChange}
              accept=".md"
              beforeUpload={beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Test;
