// 创建组件
import React, {Component} from 'react';
import './Travels.css';
class Travels extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className='travels'>
                <h1>这是旅游攻略</h1>
            </div>
        )
    }
}

export default Travels;
