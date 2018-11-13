import React, {Component} from 'react';
import {Form, Input, Icon, Button, Checkbox,message} from 'antd';
import axios from 'axios';
import './ZhuceSection.css';

const FormItem = Form.Item;

class ZhuceSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            num:'',
            veriNum:''
        }
    }
    success = (msg) => {
        message.success(msg).then(()=>{
            this.props.history.push('/app/login');
        })
    };
    warning = (msg) => {
        message.warning(msg)
    };
    info = (msg) => {
        message.info(msg);
    };
    //提交，请求
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.get('/user/zhuce', {
                    params: values
                }).then((res) => {
                    if(res.status===200){
                        if(res.data.error===0){
                            this.success(res.data.msg)
                        }
                        if(res.data.error===1){
                            this.warning(res.data.msg);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        });
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        // console.log(e.target);
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
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('密码不一致，请重新输入');
        } else {
            callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };
   // 获取验证码
   getVerify=()=>{
       let num = this.state.num;
       axios.get('/zhuce/getNum',{
              params:num
          }).then((res)=>{
           if(res.status===200){
               if(res.data.error===0){
                   this.info(res.data.msg);
                   this.setState({
                       veriNum:res.data.verifyNum
                   })
               }
               if(res.data.error===1){
                   this.warning(res.data.msg);
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
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        return (
            <div className='zhuce'>
                <Form onSubmit={this.handleSubmit}>
                    {/*用户名*/}
                    <FormItem
                        {...formItemLayout}
                        label='用户名' >
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: '用户名不能为空', whitespace: true},
                                {min: 2, message: '长度不在范围内'},
                                {pattern: new RegExp('^[\u4E00-\u9FA5A-Za-z]+$', 'g'), message: '用户名必须为英文字母或者中文'}],
                        })(
                            <Input name='username' onBlur={this.handleConfirmBlur} prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                   placeholder='请输入用户名'/>
                        )}
                    </FormItem>
                    {/*邮箱*/}
                    <FormItem{...formItemLayout} label="E-mail">
                        {getFieldDecorator('email', {
                            rules: [{type: 'email', message: '输入的不是邮箱', whitespace: true},
                                {required: true, message: '请输入邮箱不能为空'}],
                        })(
                            <Input type='email' name='email' onBlur={this.handleConfirmBlur}
                                   prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder='请输入邮箱'/>
                        )}
                    </FormItem>
                    {/*密码*/}
                    <FormItem{...formItemLayout} label="密码">
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入密码!', whitespace: true
                            },
                                {validator:this.validateToNextPassword,},
                                {
                                    pattern: new RegExp('^[a-zA-Z][a-zA-Z0-9_]{5,15}$', 'g'),
                                    message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
                                }
                            ],
                        })(
                            <Input  name='password' placeholder='请输入密码' onBlur={this.handleConfirmBlur}
                                   prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>
                        )}
                    </FormItem>
                    {/*确认密码*/}
                    <FormItem{...formItemLayout} label="确认密码">
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: '请再次输入密码'
                            }, {
                                validator: this.compareToFirstPassword
                            },
                                {
                                    pattern: new RegExp('^[a-zA-Z][a-zA-Z0-9_]{5,15}$', 'g'),
                                    message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
                                }],
                        })(
                            <Input name='confirm' placeholder='请确认密码'
                                   prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />} />
                        )}
                    </FormItem>
                    {/*验证码*/}
                    <FormItem{...formItemLayout} label="验证码">
                        {getFieldDecorator('verify', {
                            rules: [
                                {required: true, message: '不能为空', whitespace: true},
                                {validator:this.verify.bind(this)}
                                ],
                        })(
                            <Input type="text"  style={{width: '150px', marginRight: '50px'}} name='verify'
                                   placeholder='请输入验证码' onBlur={this.handleConfirmBlur} />
                        )}
                        <Button onClick={this.getVerify}>获取验证码</Button>
                    </FormItem>
                    {/*提交*/}
                    <FormItem stype={{marginBottom: '0 !important'}}>
                        <Button type="primary" style={{
                            width: '300px',
                            marginLeft: '30px',
                            borderRadius: '20px',
                            background: 'rgb(52,115,225)',
                            color: '#ffffff'
                        }} htmlType="submit">提交</Button>
                    </FormItem>
                    {/*记住密码，管理员身份*/}
                    <FormItem style={{width:'250px', display:'inline-block'}}>
                        {getFieldDecorator('remember', {valuePropName: 'checked', initialValue:true,})(<Checkbox>Remember
                            me</Checkbox>)}
                    </FormItem>
                    <FormItem style={{width:'200px',display:'inline-block'}}>
                        {getFieldDecorator('admin', {valuePropName: 'checked', initialValue: false,})(<Checkbox>管理员</Checkbox>)}
                    </FormItem>
                </Form>
            </div>
        );
    }
}
ZhuceSection = Form.create({})(ZhuceSection);
export default ZhuceSection;

