// 创建组件
import React, {Component} from 'react';
import './Line.css';
class Line extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className='line'>
                <h1>这是路线页面</h1>
            </div>
        )
    }
}

export default Line;
