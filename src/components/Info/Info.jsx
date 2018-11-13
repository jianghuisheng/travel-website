// 创建组件
import React, {Component} from 'react';
import {Form, Input, DatePicker, Cascader, Select, Button, Avatar,Radio,message} from 'antd';
import axios from "axios/index";
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

const residences = [{
    value: '浙江',
    label: '浙江',
    children: [{
        value: '杭州',
        label: '杭州',
        children: [{
            value: '西湖',
            label: '西湖',
        }],
    }],
}, {
    value: '江苏',
    label: '江苏',
    children: [{
        value: '南京',
        label: '南京',
        children: [{
            value: '中华门',
            label: '中华门',
        }],
    }],
}];

class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            autoCompleteResult: [],
            User: ''
        }
    };
    componentDidMount() {
        this.firstGetInfo();
    }
    firstGetInfo=()=>{
        axios.get('/user/addInfo', {
            params: {
                User: localStorage.getItem('username'),
            }
        }).then((res) => {
            console.log(res.data);
            this.setState({
                User: res.data.user
            });
        }).catch((err) => {
            console.log(err);
        })
    };
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('接收的数据: ', values);
                axios.get('/user/addUserInfo', {
                    params: values
                }).then((res) => {
                    if(res.status===200){
                        if(res.data.error===0){
                            this.setState({
                                info:res.data
                            });
                            this.success(res.data.msg);
                            this.firstGetInfo();
                        }
                        if(res.data.error===1){
                            this.error(res.data.msg);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        });
    };
    handleFormLayoutChange = (e) => {
        this.setState({formLayout: e.target.value});
    };
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 15},
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{width: 70}}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (
            <div className='detail'>
                <Form onSubmit={this.handleSubmit}>
                    {
                        this.state.User && <Avatar size={100} style={{display: 'block'}} src={this.state.User.headPhoto} />
                    }
                    <FormItem{...formItemLayout} label='头像'>
                        {getFieldDecorator('headPhoto', {
                            initialValue:this.state.User.headPhoto||'',
                            rules: [{required: true, message: '请输入图片'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout} label='用户名'>
                        {getFieldDecorator('username', {initialValue: this.state.User.username}, {
                            rules: [{required: true, message: '请输入用户名', whitespace: true}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮箱"
                    >
                        {getFieldDecorator('email', {initialValue: this.state.User.email}, {
                            rules: [{
                                type: 'email', message: '输入的不是邮箱',
                            }, {
                                required: true, message: '请输入邮箱',
                            }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout} label="家庭住址">
                        {getFieldDecorator('address', {
                            initialValue: this.state.User.address||['浙江', '杭州', '西湖'],
                            rules: [{type: 'array', required: true, message: '请输入地址'}],
                        })(
                            <Cascader options={residences}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="出生日期">
                        {getFieldDecorator('birthDay',{
                            initialValue:moment(this.state.User.birthDay, dateFormat)||moment('2015/01/01', dateFormat)
                        })(
                            <DatePicker style={{width: '42vw'}}/>
                        )}
                    </FormItem>
                    <FormItem{...formItemLayout} label="手机号码">
                        {getFieldDecorator('phoneNumber',
                            {initialValue:this.state.User.phoneNumber||'122233225355'
                            },{
                            rules: [{type:'number',required: true, message: '请输入手机号码'},
                                {min:11, max:11, message: '长度不符合规则'}],
                        })(
                            <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
                        )}
                    </FormItem>
                    <FormItem label="性别" {...formItemLayout}>
                        {getFieldDecorator('sex',{
                            initialValue:this.state.User.sex===true?'true':'false'
                        })(
                            <Radio.Group  buttonStyle="solid">
                                <Radio.Button value="false" style={{width:'100px'}}>男</Radio.Button>
                                <Radio.Button value="true" style={{width:'100px'}}>女</Radio.Button>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <FormItem  {...formItemLayout} label="个性签名">
                        {getFieldDecorator('signature',{
                            initialValue:this.state.User.signature||'例如:吃货一枚'
                        },{
                            rules: [{required: true, message: '请输入个性签名'},
                                {min: 2, max: 30, message: '长度为2-30'}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem  {...formItemLayout}>
                        <Button type="primary" style={{width:'40vw',marginLeft:'14vw'}} htmlType="submit">修改</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

Info = Form.create({})(Info);
export default Info;
