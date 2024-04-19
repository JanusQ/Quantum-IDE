/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {
  Card,
  Space,
  Table,
  Tag,
  Input,
  Select,
  Drawer,
  message,
  Button,
  Modal,
  Row,
  Col,
} from 'antd'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { getProList, delPro } from '@/api/project'
import { createPro } from '@/api/test_circuit'

export default function Project() {
  const navigate = useNavigate()
  const { userData } = useSelector((store) => store.userData)
  const { t } = useTranslation()
  // 分页处理
  const [current, setCurrent] = useState(1)
  const [total, setTotal] = useState(100)
  const [pageSize, setPageSize] = useState(10)
  // eslint-disable-next-line no-shadow
  const onChange = (page, pageSize) => {
    setPageSize(pageSize)
    setCurrent(page)
  }
  const pagination = {
    current,
    total,
    pageSize,
    onChange,
    // eslint-disable-next-line no-shadow
    showTotal: (total) => `共 ${total} 条数据`,
    showQuickJumper: true,
  }
  const loadPro = (record) => {
    navigate('/aceComputer', {
      state: { projectName: record.project_name, projectId: record.project_id },
    })
  }

  // 搜索项目
  const { Search } = Input
  const [searchValue, setSearchValue] = useState('')
  const searchValueChange = (e) => {
    setSearchValue(e.target.value)
  }
  // 获取项目列表
  const [projectList, setProjectList] = useState([])
  const getProListFn = async () => {
    const formData = new FormData()
    formData.append('user_id', userData.user_id)
    if (searchValue) {
      formData.append(
        'filter',
        JSON.stringify({
          project_name: searchValue,
        })
      )
    }
    const { data } = await getProList(formData)
    setProjectList(data.project_list.reverse())
  }
  useEffect(() => {
    getProListFn()
  }, [])

  const onSearch = () => {
    getProListFn()
  }
  //  创建项目
  const [isSaveCaseModalVisible, setIsSaveCaseModalVisible] = useState(false)
  const [caseName, setCaseName] = useState('')
  const onSaveChange = (e) => {
    setCaseName(e.target.value)
  }
  const isSaveCancel = () => {
    setIsSaveCaseModalVisible(false)
    setCaseName('')
  }
  const lookTask = (record) => {
    if (record.task_num) {
      navigate('/projects/task', {
        state: {
          projectName: record.project_name,
          taskId: record.project_id,
        },
      })
    } else {
      message.error('所选项目暂无任务提交')
    }
  }
  const isSaveOk = async () => {
    if (!caseName) {
      message.error('请输入项目名称')
      return
    }
    const formdata = new FormData()
    formdata.append('user_id', userData.user_id)
    formdata.append('project_name', caseName)
    const { data } = await createPro(formdata)
    if (data.msg == '成功') {
      message.success('Add successfully')
      navigate('/aceComputer', {
        state: {
          projectName: caseName,
          projectId: data.project_id,
        },
      })
      // getProListFn()
    }

    // navigate("/aceComputer", {
    //   state: {
    //     projectName: caseName,
    //     taskId: data.project_id,
    //   },
    // })
    setIsSaveCaseModalVisible(false)
  }
  const gotoComputer = () => {
    if (!userData.user_id) {
      message.error('请先登录')
      navigate('/signin')
      // return
    }
    setIsSaveCaseModalVisible(true)
  }
  // 删除
  const deleteTask = (id) => {
    Modal.confirm({
      title: '确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const formData = new FormData()
        formData.append('project_id', id)
        formData.append('user_id', userData.user_id)
        await delPro(formData)
        message.success('已删除', 0.5)
        getProListFn()
      },
    })
  }
  const columns = [
    {
      title: t('list.serial number'),
      dataIndex: 'index',
      width: 150,
      render: (text, record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
      ellipsis: true,
    },
    {
      title: t('list.project name'),
      dataIndex: 'project_name',
      key: 'project_name',
      ellipsis: true,
      // render: (text, record) => {
      // 	return <a onClick={() => loadPro(record)}>{text}</a>
      // },
    },
    {
      title: t('list.task numbet'),
      dataIndex: 'task_num',
      key: 'task_num',
      ellipsis: true,
    },
    {
      title: t('list.creation time'),
      dataIndex: 'created_time',
      key: 'created_time',
      render: (text) => moment(text).format('YYYY-MM-DD HH:MM:SS'),
      ellipsis: true,
    },
    {
      title: t('list.operation'),
      dataIndex: 'step',
      key: 'step',
      width: 300,
      render: (text, record) => (
        <span>
          <Button
            onClick={() => {
              loadPro(record)
            }}
            style={{ marginRight: '39px', padding: '0' }}
            type="link"
          >
            {t('list.edit item')}
          </Button>
          <Button
            disabled={record.task_num === 0}
            onClick={() => {
              // lookTask(record)
            }}
            style={{ marginRight: '39px', padding: '0' }}
            type="link"
          >
            <a
              onClick={() => {
                lookTask(record)
              }}
            >
              {t('list.view details')}
            </a>
          </Button>
          <a onClick={() => deleteTask(record.project_id)}>
            {t('list.delete')}
          </a>
        </span>
      ),
    },
  ]
  return (
    <div className={styles.root}>
      <Card
        bordered={false}
        // style={{
        //   width: '100%',
        //   height: '100%',
        // }}
        title={t('project.projectList')}
      >
        <Row justify="center">
          <Col span={8}>
            <Search
              enterButton
              onChange={searchValueChange}
              onSearch={onSearch}
              placeholder={t('project.Please enter a project name')}
              style={{ marginBottom: '40px' }}
              value={searchValue}
            />
          </Col>
        </Row>

        <div className="addProject">
          <Button
            onClick={gotoComputer}
            style={{ float: 'right' }}
            type="primary"
          >
            {t('project.add')}
          </Button>
        </div>
        <Table columns={columns} dataSource={projectList} rowKey="project_id" />
      </Card>
      <Modal
        cancelText={t('isok.cancel')}
        okText={t('isok.confirm')}
        onCancel={isSaveCancel}
        onOk={isSaveOk}
        open={isSaveCaseModalVisible}
        title={t('project.stored item')}
      >
        <p>{t('project. project name')}</p>
        <Input onChange={onSaveChange} value={caseName} />
      </Modal>
    </div>
  )
}
