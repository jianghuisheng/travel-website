// 创建组件
import React, {Component} from 'react';
import { Form, Input, Steps, Button, message} from 'antd';
import './Search.css';
import axios from "axios";
import qs from 'qs';
const Step = Steps.Step;
const FormItem = Form.Item;
const steps = [
    {title: '第一步'},
    {title: '第二步'},
    {title: '完成'}
    ];
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            current: 0,
            num:'',
            veriNum:''
        }
    }
    next() {
        const current = this.state.current + 1;
        this.setState({
            current
        })
    }
    prev() {
        const current = this.state.current - 1;
        this.setState({
            current
        });
    }
    success = (msg) => {
        message.success(msg);
    };
    error = (msg)=>{
        message.error(msg);
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        if(e.target.type ==='email'){
            this.setState({
                num:e.target.value
            })
        }
        if(e.target.name ==='verify'){
            this.setState({
                veriNum:e.target.value
            })
        }
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致');
        } else {
            callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/user/search',qs.stringify(values)).then((res)=>{
                    if(res.status===200){
                        if(res.data.error===0){
                            this.success(res.data.msg);
                            this.next();
                            this.setState({
                                userName:res.data.username
                            })
                        }
                        if(res.data.error===1){
                            this.error(res.data.msg);
                        }
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            }
        });
    };
    // 获取验证码
    getVerify=()=>{
        let num = this.state.num;
        axios.get('/search/getNum',{
            params:num
        }).then((res)=>{
            console.log(res);
            if(res.status===200){
                if(res.data.error===0){
                    this.success(res.data.msg);
                    this.setState({
                        veriNum:res.data.verifyNum
                    })
                }
                if(res.data.error===1){
                    this.error(res.data.msg);
                }
            }
        }).catch((err)=>{
            console.log(err);
        })
    };
    //验证验证码
    verify=(rule, value, callback)=>{
        console.log(value);
        if(value!==this.state.veriNum){
            callback('验证码输入错误');
        }else{
            callback();
        }
    };
    //重置成功后跳转至登录页面，重新登录
    handleSkipLoginPage=()=>{
      this.props.history.push('/app/login')
    };
    render() {
        const { current } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div className='search'>
                <div className='header'>
                    <Steps current={current} style={{height:'60px'}}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <div className="steps-content">{steps[current].content}</div>
                </div>
              <Form onSubmit={this.handleSubmit}>
                   {/*第一页*/}
                   <FormItem{...formItemLayout} label='用户名' className={this.state.current===0 ? "show":'hidden'}>
                       {getFieldDecorator('username', {
                           rules: [{ required:this.state.current===0? true:false, message:'请输入用户名', whitespace: true },
                                    { min:2,message: '长度不在范围内' }],
                       })(
                           <Input placeholder='请输入用户名' />
                       )}
                   </FormItem>
                   <FormItem{...formItemLayout} label="邮箱" className={this.state.current===0 ? "show":'hidden'}>
                       {getFieldDecorator('email', {
                           rules: [{
                               type: 'email', message: '输入的不是邮箱',
                           }, {
                               required:this.state.current===0 ? true:false, message: '请输入你的邮箱',
                           }],
                       })(
                         <Input type='email' onBlur={this.handleConfirmBlur} placeholder='请输入邮箱' />
                       )}
                   </FormItem>
                  {/*验证码*/}
                  <FormItem{...formItemLayout} label="验证码" className={this.state.current===0 ? "show":'hidden'}>
                      {getFieldDecorator('verify', {
                          rules: [
                              {required:this.state.current===0 ? true:false, message: '不能为空', whitespace: true},
                              {validator:this.verify.bind(this)}
                          ],
                      })(
                          <Input type="text"  style={{width: '150px', marginRight: '50px'}} name='verify'
                                 placeholder='请输入验证码' onBlur={this.handleConfirmBlur} />
                      )}
                      <Button onClick={this.getVerify}>获取验证码</Button>
                  </FormItem>
                  {/*第二页*/}
                  <FormItem {...formItemLayout} label="输入新密码" className={this.state.current===1 ? "show":'hidden'}>
                      {getFieldDecorator('password', {
                          rules: [{
                              required:this.state.current===1 ? true:false, message: '请输入密码',
                          }, {
                              validator: this.validateToNextPassword,
                          }],
                      })(
                          <Input type="password" placeholder='请输入新密码' />
                      )}
                  </FormItem>
                  <FormItem{...formItemLayout} label="再次输入密码" className={this.state.current===1 ? "show":'hidden'}>
                      {getFieldDecorator('confirm', {
                          rules: [{
                              required:this.state.current===1 ? true:false, message: '请再次输入密码!',
                          }, {
                              validator: this.compareToFirstPassword,
                          }],
                      })(
                          <Input type="password" placeholder='请再次输入密码' onBlur={this.handleConfirmBlur} />
                      )}
                  </FormItem>
                    <FormItem>
                        <div className="steps-action" style={{width:'200px',marginLeft:'130px'}}>
                            {
                                current < steps.length - 1 && <Button htmlType="submit" type="primary">下一步</Button>
                            }
                            {
                                current > 0
                                && (<Button style={{ marginLeft: 8 }} onClick={() => this.prev()} className={this.state.current===2||1? "hidden":''}>上一步</Button>)
                            }
                        </div>
                    </FormItem>
               </Form>
                {/*第三页*/}
               <section className={this.state.current===2 ? "show":'hidden'}>
                   <h1>密码重置成功</h1>
                       <div className='imag'
                            onClick={this.handleSkipLoginPage.bind(this)}
                       >
                       </div>
               </section>
            </div>
        )
    }
}

Search = Form.create({})(Search);
export default Search;
