// 创建组件
import React, {Component} from 'react';
import './Destination.css';
class Destination extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className='destination'>
                <h1>这是目的地页面</h1>
            </div>
        )
    }
}

export default Destination;
