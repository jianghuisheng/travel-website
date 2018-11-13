import React, {Component} from 'react';
import {Form, Input, Icon, Button,message,Tooltip} from 'antd';
import  axios from 'axios';
import qs from 'qs';
import './LoginSection.css';

const FormItem = Form.Item;

class LoginSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false
        }
    }
    success = (msg) => {
        message.success(msg).then(()=>{
            this.props.history.push('/');
        })
    };
    error = (msg) => {
        message.error(msg).then(()=>{
            this.props.history.push('/app/zhuce');
        });
    };
    warning = (msg) => {
        message.warning(msg);
    };
    handleSkipZhuce=()=>{
        this.props.history.push('/app/zhuce');
    };
    handleSkipSearch=()=>{
        this.props.history.push('/app/search');
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/user/login',qs.stringify(values)).then((res)=>{
                    if(res.status===200){
                        if(res.data.error===0){
                            this.success(res.data.msg);
                            localStorage.setItem('token',res.data.token);
                            localStorage.setItem('admin',res.data.admin);
                            localStorage.setItem('username',res.data.username);
                        }
                        if(res.data.error===1){
                            this.warning(res.data.msg);
                        }
                        if(res.data.error===2){
                            this.error(res.data.msg);
                        }
                    }
                }).catch((err)=>{
                    console.log(err);
                })
            }
        });
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: false});
        }
        callback();
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
            <div className='login'>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label={<span>用户名<Tooltip title="输入用户名或者邮箱">
                        <Icon type="exclamation-circle" />
                    </Tooltip></span> }>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: '请输入你的名字', whitespace: true},
                                {min: 2, message: '长度不在范围内'},
                                {
                                    // pattern: new RegExp('^[\u4E00-\u9FA5A-Za-z0-9]+$', 'g'),
                                    message: '用户名必须为英文字母或者中文或数字'
                                }],
                        })(
                            <Input placeholder='请输入姓名或者邮箱'
                                   prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}/>
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout} label="密码">
                        {getFieldDecorator('password', {
                            rules: [{required: true, message: '请输入密码!'},
                                {validator: this.validateToNextPassword},
                                {
                                    pattern: new RegExp('^[a-zA-Z][a-zA-Z0-9_]{5,15}$', 'g'),
                                    message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
                                }
                            ],
                        })(
                            <Input type="password" placeholder='请输入密码'
                                   prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" style={{
                            width: '300px',
                            borderRadius: '20px',
                            background: 'rgb(52,115,225)',
                            color: '#ffffff',
                            marginLeft: '30px'
                        }} htmlType="submit">登陆</Button>
                    </FormItem>
                    <FormItem style={{width:'200px',display:'inline-block'}}>
                        <span style={{fontSize: '16px', display: 'inline-block', width: '100px'}}>还没有账号?</span>
                        <h4 style={{
                            display:'inline-block',
                            color:'rgb(52,115,225)',
                            textDecoration:'underline',
                            cursor:'pointer'}} onClick={this.handleSkipZhuce.bind(this)}>
                            立即注册
                        </h4>
                    </FormItem>
                    <FormItem style={{width:'200px',display:'inline-block'}}>
                        <h4 style={{
                            display:'inline-block',
                            color:'rgb(52,115,225)',
                            textDecoration:'underline',
                            cursor:'pointer'}} onClick={this.handleSkipSearch.bind(this)}>
                            忘记密码？
                        </h4>
                    </FormItem>
                </Form>
            </div>
        );

    }
}
LoginSection = Form.create({})(LoginSection);
export default LoginSection;

