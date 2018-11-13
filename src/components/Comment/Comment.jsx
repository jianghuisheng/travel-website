// 创建组件
import React, {Component} from 'react';
import axios from 'axios';
import { Avatar ,Rate, Input,Form,Button,message} from 'antd';
const { TextArea } = Input;
const FormItem = Form.Item;
class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order:{},
            value: 3,
        }
    }
    success = (msg) => {
        message.success(msg)
    };
    error = (msg) => {
        message.error(msg)
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let data = {
                    orderId:this.props.match.params.id,
                    values,
                    username:localStorage.getItem('username')
                };
                axios.post('/user/comment/add',data).then((res)=>{
                    if(res.status===200){
                        if(res.data.error===0){
                            this.success(res.data.msg);
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
    componentDidMount(){
        let data = {
            orderId:this.props.match.params.id
        };
        axios.post('/user/comment',data).then((res)=>{
            if(res.status===200){
                if(res.data.error===0){
                    this.setState({
                        order:res.data.order
                    });
                    this.success(res.data.msg);
                }
                if(res.data.error===1){
                    this.error(res.data.msg);
                }
            }

        }).catch((err)=>{
            console.log(err);
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <div className='comment'
                 style={{paddingTop:'100px',width:'500px',margin:'0 auto',height:'700px'}}>
               <div className='comment_top' style={{marginTop:'20px',overflow:'hidden',padding:'20px'}}>
                   <Avatar shape="square" size={100} src={this.state.order.shopImage} />
                   <h2 style={{color:'red',fontFamily:'楷体',fontSize:'30px'}}>{this.state.order.shopName}</h2>
               </div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout} label="评分">
                        {getFieldDecorator('rate', {initialValue: 3.5})(
                            <Rate />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout} label="评论">
                        {getFieldDecorator('comment_text')(
                            <TextArea autosize={{ minRows: 2, maxRows: 6 }}  style={{marginTop:'30px'}}/>
                        )}
                    </FormItem>
                    <FormItem  wrapperCol={{ span: 12, offset: 6 }}>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
Comment = Form.create({})(Comment);
export default Comment;
