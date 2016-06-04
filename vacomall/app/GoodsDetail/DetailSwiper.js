/**
 * Created by renyubin on 16/6/4.
 */
import React,
    {
    Component,
    View,
    StyleSheet,
    Image
}from 'react-native';
import Swiper from 'react-native-swiper2';
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
                <Image style={styles.slide} source={{uri:data['ImagePath']+"@h_600"}}></Image>
            </View>)
        })
        this.setState({
            swiper: <Swiper height={414} autoplay={true} paginationStyle={{bottom: 5,flex:1}}>{imagesArray}</Swiper>
        })
    }
    render(){
        return(
            <View style={{height:414}}>
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