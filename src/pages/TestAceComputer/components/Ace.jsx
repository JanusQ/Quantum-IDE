import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import AceEditor from 'react-ace'
import '../styles/Ace.css'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/ext-language_tools'
// import '../styles/CommonAntDesign.css'
import { Button, Select, Modal, Tooltip } from 'antd'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  CloseOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { createFile } from '@/simulator/CommonFunction'
import QCEngine from '@/simulator/MyQCEngine'
import { Link } from 'react-router-dom'
const Ace = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    exportFile,
  }))
  // 初始化字体
  const [fontSize, setFontSize] = useState(12)
  // 控制字体
  const controlFontSize = (type) => {
    if (type === 'add') {
      if (fontSize >= 12 && fontSize <= 40) {
        setFontSize(fontSize + 1)
      }
    } else {
      if (fontSize > 12) {
        setFontSize(fontSize - 1)
      }
    }
  }

  // 多个选择框
  const { Option } = Select

  // case的列表，public\js中需要存对应的文件
  // const optionList = ['Quantum Fourier Transform', 'Grover\'s Algorithm', 'Shor\'s Algorithm', 'Deutsch-Jozsa Algorithm', 'Simon\'s Algorithm', 'Bernstein-Vazirani Algorithm','Quantum Supersampling','Entangled Qubits','Adding two quantum intergers','Repeated iterations','Phase estimation','about:black']
  const options = [
    {
      value: 'ghz_state',
      label: 'GHZ state',
    },
    {
      value: 'w_state',
      label: 'W state',
    },
    {
      value: 'time_crystal',
      label: 'Time crystal',
    },
    {
      value: 'VQA',
      label: 'Quantum Neural Network',
    },
  ]
  //导出
  const FileSaver = require('file-saver')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const exportFile = () => {
    setIsModalVisible(true)
  }

  // 多个类型
  const typeArr = [
    { name: 'SVG', type: 'svg' },
    { name: 'JavaScript', type: 'js' },
  ]
  const typeListChildren = []
  for (let i = 0; i < typeArr.length; i++) {
    typeListChildren.push(
      <li type={typeArr[i].type} key={i}>
        {typeArr[i].name}
      </li>
    )
  }
  // 导出选择类型
  const exportTypeClick = (e) => {
    const eEvent = e || window.event
    try {
      let qc = new QCEngine()
      const { qint } = qc

      eval(props.editorValue)
      const svg = createFile(qc.circuit, eEvent.target.type)
      let blob = new Blob([svg])
      FileSaver.saveAs(blob, `test.${eEvent.target.type}`)
      qc = null
    } catch (error) {
      console.log(error)
    }
  }
  // 弹出框事件
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  // 代码补全内容数组
  const completers = [
    {
      name: 'name',
      value: 'qc',
      score: 1,
      meta: '实例',
    },
    {
      name: 'name',
      value: 'print',
      score: 1,
      meta: '打印',
    },
  ]
  const complete = (editor) => {
    //向编辑器中添加自动补全列表
    editor.completers.push({
      getCompletions: function (editor, session, pos, prefix, callback) {
        callback(null, completers)
      },
    })
  }
  const runProgram = () => {
    props.changCircuit(false)
    props.runProgram(false)
  }
  return (
    <div className="left_top_div">
      <div className="ace_div">
        <div className="title" style={{ padding: 10 }}>
          <Link to={'/home'}>
            <HomeOutlined style={{ marginRight: 20, color: 'rgb(0, 0, 0)' }} />
          </Link>
          QuCode
          <Tooltip
            placement="right"
            title={
              'Here is the code editor to write a program and execute a quantum circuit.'
            }
          >
            <span className="tip_svg"></span>
          </Tooltip>
        </div>
        {/* 操作按钮 */}
        <div className="ace_operation">
          <Button
            type="primary"
            onClick={runProgram}
            style={{ background: '#649FAE' }}
          >
            {props.runProgramName}
          </Button>

          <Select
            style={{ width: '35%', marginLeft: '10px' }}
            onChange={props.selectChange}
            optionLabelProp="label"
            options={options}
            defaultValue="ghz_state"
          ></Select>
          <Select
            style={{ width: '35%', marginLeft: '10px' }}
            onChange={props.onSelectRunChange}
            // optionLabelProp="label"
            defaultValue="JavaScript_simulator"
          >
            <Option key={1} value="JavaScript_simulator">
              JavaScript_simulator
            </Option>
            <Option key={2} value="qiskit">
              Python simulator
            </Option>
            <Option key={3} value="sqcg">
              Quantum computer
            </Option>
          </Select>
          {/* <ZoomInOutlined
            style={{ marginLeft: '5%', cursor: 'pointer', fontSize: '18px' }}
            onClick={() => {
              controlFontSize('add')
            }}
          />
          <ZoomOutOutlined
            style={{ marginLeft: '5px', cursor: 'pointer', fontSize: '18px' }}
            onClick={() => {
              controlFontSize('sub')
            }}
          /> */}
        </div>
        {/* ace编辑器 */}
        <AceEditor
          mode="javascript"
          theme="github"
          readOnly={true}
          onChange={props.onChange}
          onLoad={complete}
          name="ACE-EDITOR"
          width="100%"
          height="84%"
          value={props.editorValue}
          showGutter={false}
          style={{
            fontSize: fontSize + 'px',
            pointerEvents: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
          highlightActiveLine={false}
          setOptions={{
            useWorker: false,
            wrap: true,
            enableLiveAutocompletion: true,
          }}
        />
        {/* 导出弹框 */}
        <Modal
          title="Export"
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
        >
          <ul className="export_type_ul" onClick={exportTypeClick}>
            {typeListChildren}
          </ul>
        </Modal>
      </div>
      <div id="self_definded">
        <div className="title">
          Circuit Resue
          <Tooltip
            placement="right"
            title={'Here are the listed circuits saved for reuse.'}
          >
            <span className="tip_svg"></span>
          </Tooltip>
        </div>
        <div id="self_definded_draw"></div>
      </div>
    </div>
  )
})
export default Ace
