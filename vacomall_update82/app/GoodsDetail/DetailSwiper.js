/**
 * Created by renyubin on 16/6/4.
 */
import React,
    {
    Component,
    View,
    StyleSheet,
    Image,
    Dimensions
}from 'react-native';
import {Swiper} from '../util/Path';
const {width,height}=Dimensions.get('window');
export default class DetailSwiper extends Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            swiper:null
        };
      }

    componentDidMount() {
        this.setImages(this.props.swiperData);
    }
    setImages(images) {
        var imagesArray = []
        images.forEach(function (data, index) {
            imagesArray.push(<View style={styles.wrapper} key={index}>
                <Image style={styles.slide} source={{uri:data['ImagePath']+"@h_500"}}></Image>
            </View>)
        });
        if(imagesArray.length===1){
            this.setState({
                swiper: <Swiper height={width} autoplay={false} paginationStyle={{bottom: 5,flex:1}}>{imagesArray}</Swiper>
            })
        }else{
            this.setState({
                swiper: <Swiper height={width} autoplay={true} paginationStyle={{bottom: 5,flex:1}}>{imagesArray}</Swiper>
            })
        }

    }
    render(){
        return(
            <View style={{height:width}}>
                {this.state.swiper}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
    },
    slide: {
        flex: 1,
        height: 414,
        resizeMode: 'stretch',
    },
});