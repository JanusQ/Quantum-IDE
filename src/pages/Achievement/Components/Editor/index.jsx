import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import {
  cos,
  sin,
  round,
  pi,
  complex,
  create,
  all,
  max,
  sparse,
  acos,
  asin,
  sqrt,
} from 'mathjs'
import {
  pow2,
  binary,
  binary2qubit1,
  range,
  toPI,
  qubit12binary,
  unique,
  sum,
  alt_tensor,
  calibrate,
  getExp,
  linear_entropy,
  binary2int,
  average,
  spec,
} from '@/simulator/CommonFunction'
import { tensor, groundState, tensorState } from '@/simulator/MatrixOperation'
import QCEngine from '@/simulator/MyQCEngine'
import styles from './index.module.scss'
import { Space, Button, Select, Tooltip } from 'antd'
import Console from '../Console'
import Title from '../Title'
import { InfoCircleOutlined } from '@ant-design/icons'

const Editor = forwardRef(
  (
    {
      setQcData,
      setMode,
      mode,
      modeList,
      projectList,
      currentProject,
      setCurrentProject,
      setSubmitModal,
    },
    ref
  ) => {
    const [editorValue, setEditorValue] = useState('')
    const [consoleValue, setConsoleValue] = useState(null)
    // 选择改变编辑器的内容
    const selectChange = (value) => {
      setQcData(null)
      setCurrentProject(value)
      // 自定义
      if (value === 'about:black') {
        setEditorValue('//please')
      } else {
        fetch('/js/' + value + '.js')
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.text()
          })
          .then((data) => {
            setEditorValue(data)
          })
          .catch((error) => {
            setEditorValue('Not Found')
          })
      }
    }
    useEffect(() => {
      selectChange('ghz_state')
    }, [])
    // 运行
    const submit = () => {
      let noBug = false
      let qc = new QCEngine()

      const { qint } = qc
      let gates = [
        'cx',
        'cy',
        'cz',
        'ch',
        'csrn',
        'cr2',
        'cr4',
        'cr8',
        'crx',
        'cry',
        'crz',
        'cu1',
        'cu2',
        'cu3',
        'cs',
        'ct',
        'csdg',
        'ctdg',
        'ccx',
        'id',
        'x',
        'y',
        'z',
        'h',
        'srn',
        'srndg',
        'r2',
        'r4',
        'r8',
        's',
        't',
        'sdg',
        'tdg',
        'rx',
        'ry',
        'rz',
        'u1',
        'u2',
        'u3',
        'swap',
        'iswap',
        'srswap',
        'xy',
        'ms',
        'yy',
        'zz',
        'had',
        'hadamard',
        'not',
        'reset',
        'cnot',
        'phase',
        'startlabel',
        'endlabel',
        'ccnot',
        'ncnot',
        'ncphase',
        'qprint',
        'cphase',
      ]
      var cx,
        cy,
        cz,
        ch,
        csrn,
        cr2,
        cr4,
        cr8,
        crx,
        cry,
        crz,
        cu1,
        cu2,
        cu3,
        cs,
        ct,
        csdg,
        ctdg,
        ccx,
        id,
        x,
        y,
        z,
        h,
        srn,
        srndg,
        r2,
        r4,
        r8,
        s,
        t,
        sdg,
        tdg,
        rx,
        ry,
        rz,
        u1,
        u2,
        u3,
        swap,
        iswap,
        srswap,
        xy,
        ms,
        yy,
        zz,
        had,
        hadamard,
        not,
        reset,
        cnot,
        phase,
        startlabel,
        endlabel,
        ccnot,
        ncnot,
        ncphase,
        cphase,
        qprint
      //let gates =['had']
      let bind_str = 'gate_name = qc.gate_name.bind(qc);\n '
      let bind_str_all = ''
      for (let ind = 0; ind < gates.length; ind++) {
        let gate = gates[ind]
        bind_str_all += bind_str.replace(/gate_name/g, gate)
      }
      eval(bind_str_all)

      try {
        eval(editorValue)
        consoleContent(true, qc.console_data)
        noBug = true
      } catch (error) {
        consoleContent(false, error.message)
        noBug = false
      }
      if (noBug) {
        qc.runCircuit()
        setQcData(qc)
        return qc
      }
    }
    useImperativeHandle(ref, () => ({
      submit,
    }))
    // 处理console
    const consoleContent = (isTure, message) => {
      if (isTure) {
        const console_list = []
        for (let i = 0; i < message.length; i++) {
          console_list.push(<p key={i}>{message[i]}</p>)
        }
        setConsoleValue(<div className="right_content">{console_list}</div>)
      } else {
        setConsoleValue(<div className="error_content">{message}</div>)
      }
    }
    const projectListAll = [
      {
        value: 'Grover_s _Algorithm',
        label: `Grover's Algorithm`,
      },
      {
        value: 'ghz_state',
        label: 'GHZ state',
      },
      {
        value: 'w_state',
        label: 'W state',
      },

      {
        value: 'VQA',
        label: 'Quantum Neural Network',
      },

      {
        value: 'Quantum Conditional Execution',
        label: `Quantum Conditional Execution`,
      },
      {
        value: 'Quantum Fourier Transform',
        label: `Quantum Fourier Transform`,
      },
      {
        value: 'time_crystal',
        label: `time_crystal`,
      },
      {
        value: 'Phase estimation',
        label: `Phase estimation`,
      },
    ]

    return (
      <div className={styles.root}>
        <div className="operation_content">
          <Space size={20}>
            <Select
              onChange={selectChange}
              value={currentProject}
              options={
                mode === 'JavaScript_simulator' ? projectListAll : projectList
              }
              style={{ width: 150 }}
            ></Select>

            <Select
              onChange={(v) => {
                setMode(v)
                setQcData(null)
                selectChange('ghz_state')
              }}
              defaultValue={mode}
              options={modeList}
              style={{ width: 170 }}
            ></Select>
            {mode === 'JavaScript_simulator' ? (
              <Button type="primary" onClick={submit}>
                Submit
              </Button>
            ) : null}
            {mode === 'Python_simulator' ? (
              <Button type="primary" onClick={() => setSubmitModal(true)}>
                Submit
              </Button>
            ) : null}
          </Space>
        </div>
        <Title title={'QuCode Editor'} />
        <div className="editor_ace_content">
          <AceEditor
            mode="javascript"
            theme="github"
            // readOnly={true}
            name="ACE-EDITOR"
            width="100%"
            height="100%"
            onChange={(value) => setEditorValue(value)}
            value={editorValue}
            // showGutter={false}
            style={{
              // fontSize: fontSize + 'px',
              // pointerEvents: 'none',
              backgroundColor: '#fff',
            }}
            highlightActiveLine={false}
            setOptions={{
              useWorker: false,
              wrap: true,
              enableLiveAutocompletion: true,
            }}
          />
        </div>
        {mode == 'JavaScript_simulator' ? (
          <div>
            <Space>
              <Title title={'Circuit Resue'} />
              <Tooltip
                placement="right"
                title={'Here are the listed circuits saved for reuse.'}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </Space>

            <div id="self_definded_draw"></div>
          </div>
        ) : null}

        <Space>
          <Title title={'Console'} />{' '}
          <Tooltip
            placement="right"
            title={
              'Here is the console. All output information are printed here.'
            }
          >
            <InfoCircleOutlined />
          </Tooltip>
        </Space>

        <Console consoleValue={consoleValue} />
      </div>
    )
  }
)
export default Editor
