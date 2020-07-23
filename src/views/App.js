import React from 'react'
import axios from 'axios'

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import { Layout, Button, Row, Col } from 'antd';
const { Content } = Layout;

const default_code = `import "io"

fn main() {
  std::print("Hello, World!");
}
`

class App extends React.Component {
  state = {
    code: default_code,
    output: '',
    is_error: false,
  };

  run = async () => {
    const { data } = await axios.post(`https://playground.san.qtmsheep.com/run`, {
      files: {
        'main.sn': this.state.code + `\n\nimport "linux/crt0"\n`,
      },
    });

    if (data.success) {
      this.setState({
        output: data.stdout,
        is_error: false,
      });
    } else {
      this.setState({
        output: data.stderr || (typeof data.error === 'string' ? data.error : 'An error occured.'),
        is_error: true,
      });
    }
  }

  updateCode = (code) => {
    localStorage.setItem('code', code)
    this.setState({ code });
  }

  componentDidMount() {
    const code = localStorage.getItem('code') || default_code;
    this.setState({ code });
  }

  render() {
    return (
      <Layout>
        <Content>
          <div>
            <Button key="1" type="primary" onClick={this.run}>Run</Button>
          </div>
          <Row className="h-100">
            <Col span={12} className="h-100">
              <div className="h-100">
                <Editor
                  value={this.state.code}
                  onValueChange={this.updateCode}
                  highlight={code => highlight(code, languages.js)}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    height: '100%',
                  }}
                />
              </div>
            </Col>
            <Col span={12}>
              <Editor
                value={this.state.output}
                padding={10}
                onValueChange={() => { }}
                highlight={code => highlight(code, languages.js)}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 12,
                  height: '100%',
                  color: this.state.is_error ? 'red' : '',
                }}
              />
            </Col>
          </Row>
        </Content>
      </Layout>
    )
  }
}

export default App;