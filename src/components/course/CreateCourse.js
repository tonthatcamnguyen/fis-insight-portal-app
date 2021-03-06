import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import PickerItem from '../../components/PickerItem'
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Sizes from '../../res/Sizes';
import moment from 'moment';
import stylesCreateCourse from '../../res/values/styles/course/stylesCreateCourse'
import SelectedDate from '../../components/utils/SelectedDate'

var dataToaNha = []
var tokenUser = ""
var courseId = ""
var editCourse = "false"
var isClick = false;
export default class CreateCourse extends React.Component {
    state = {
        dataBuilding: {
            toaNhaPhongHoc: [],
            phongHoc: []
        },
        course: {
            tenKhoa: "",
            giangVien: "",
            toaNha: "",
            phongHoc: "",
            dateStart: new Date(),
            dateEnd: new Date()
        },
        validate: {
            show: false,
            khoa: true,
            giangVien: true,
            ngayBatDau: true,
            ngayKetThuc: true,
            toaNha: true,
            phong: true
        },
        errorMessageEndDay: false,


    }
    checkDate = async () => {
        if (this.state.course.dateStart.getTime() >= this.state.course.dateEnd.getTime()) {
            await this.setState({
                validate: {
                    ...this.state.validate,
                    ngayKetThuc: true
                }
            })
        } else {
            await this.setState({
                validate: {
                    ...this.state.validate,
                    ngayKetThuc: false
                }
            })
        }
    }


    onValidateTextKhoa(value) {
        if (value.length) {
            this.setState(prevProps => ({
                validate: {
                    ...prevProps.validate,
                    khoa: false
                }
            }))
        } else {
            this.setState(prevProps => ({
                tenKhoa: "",
                validate: {
                    ...prevProps.validate,
                    khoa: true
                }
            }))
        }
    }
    onValidateTextGiangVien(value) {
        if (value.length) {
            this.setState(prevProps => ({
                validate: {
                    ...prevProps.validate,
                    giangVien: false
                }
            }))
        } else {
            this.setState(prevProps => ({
                course: {
                    ...prevProps.course,
                    giangVien: ""
                },
                validate: {
                    ...prevProps.validate,
                    giangVien: true
                }
            }))
        }
    }
    onValidateToaNha() {
        this.state.course.toaNha !== undefined &&
            this.setState(prevProps => ({
                validate: {
                    ...prevProps.validate,
                    toaNha: false
                }
            }))
    }
    onValidatePhongHoc() {
        this.state.course.phongHoc !== undefined &&
            this.setState(prevProps => ({
                validate: {
                    ...prevProps.validate,
                    phong: false
                }
            }))
    }

    onPressSetState(value) {
        alert(value)
    }

    componentDidMount() {
        editCourse = JSON.stringify(this.props.navigation.getParam("editCourse", "false"));
        let course = (this.props.navigation.getParam("course", "Ko c?? Course item"));
        if (editCourse == "true") {
            this.setState(prevProps => ({
                validate: {
                    ...prevProps.validate,
                    
                    toaNha: false,
                    phong: false,
                   
 
                },
                course: {
                    ...prevProps.course,
                    
                    toaNha: { id: course.buildingId, label: course.buildingName },
                    phongHoc: { id: course.roomId, label: course.roomName },
                    
                },
 
            }))
        }
    }
    componentWillMount()
    {
        tokenUser = this.props.navigation.getParam("tokenuser", "Ko c?? token user")
        editCourse = JSON.stringify(this.props.navigation.getParam("editCourse", "false"))
        let course = (this.props.navigation.getParam("course", "Ko c?? Course item"))
 
        courseId = course.course_id
 
        this.props.buildingAction(tokenUser)
        if (editCourse == "true") {
            this.setState(prevProps => ({
                validate: {
                    ...prevProps.validate,
                    khoa: false,
                    giangVien: false,
                    toaNha: false,
                    phong: false,
                    ngayBatDau: false,
                    ngayKetThuc: false,
 
                },
                course: {
                    ...prevProps.course,
                    tenKhoa: course.courseName,
                    giangVien: course.trainer,
                    toaNha: { id: course.buildingId, label: course.buildingName },
                    phongHoc: { id: course.roomId, label: course.roomName },
                    dateStart: new Date(course.startedDate),
                    dateEnd: new Date(course.endedDate)
                },
 
            }))
        }
    }

    async componentDidUpdate(prevProps) {
        const { data, error, loading } = this.props
        if (error !== null && error !== prevProps.error) {
            alert(error)
            return
        }
        if (data !== null && data !== prevProps.data) {
            // dataToaNha: ch???a id v?? t??n c???a t??a nh??
            dataToaNha = this.props.data.data.map((value) => {
                return {
                    id: value._id,
                    label: value.buildingName,
                }
            })
            // dataToaNhaPhongHoc: ch???a id t??a nh?? v?? m???ng ph??ng h???c
            let dataToaNhaPhongHoc = this.props.data.data.map((value) => {
                return {
                    id: value._id,
                    value: value.room.map((item) => {
                        return { id: item._id, label: item.roomName + " - " + item.location }
                    })
                }
            })
            await this.setState(prevProps => ({
                dataBuilding: {
                    ...prevProps.dataBuilding,
                    toaNhaPhongHoc: dataToaNhaPhongHoc
                }
            }))

            if (editCourse == "true") {
                let idToaNha = this.state.course.toaNha.id
                let dataPhongHoc = (idToaNha) => {
                    for (let i = 0; i < this.state.dataBuilding.toaNhaPhongHoc.length; i++) {
                        if (this.state.dataBuilding.toaNhaPhongHoc[i].id == idToaNha) {
                            return this.state.dataBuilding.toaNhaPhongHoc[i]
                        }
                    }
                } 
                await this.setState(prevProps => ({
                    dataBuilding: {
                        ...prevProps.dataBuilding,
                        phongHoc: dataPhongHoc(idToaNha).value
                    }
                }))
            }
        }
    }

    checkValidate() {
        for (let item of Object.values(this.state.validate)) {
            if (item == true) {
                return true
            }
        }
        return false
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
                <View>
                    <View style={stylesCreateCourse.headerNavigation}>
                        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
                            <MaterialIcons name={"arrow-back-ios"} size={25}
                                color="#B7BEC7" style={stylesCreateCourse.iconBack} />
                        </TouchableOpacity>
                        <Text style={[{ textTransform: "uppercase" }, stylesCreateCourse.txtStyleBasic]}  >T???o m???i kh??a h???c</Text>
                        <TouchableOpacity>
                            <Entypo name={"plus"} size={20} color="#B7BEC7" style={stylesCreateCourse.iconAddCourse} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView >
                    <View style={stylesCreateCourse.background}>
                        <Text style={stylesCreateCourse.txtStyleBasic}>T??n kh??a</Text>
                        {/* Validate */}
                        {(this.state.validate.show && this.state.validate.khoa) && (
                            <Text style={stylesCreateCourse.txtValidate}>* T??n kh??a h???c kh??ng ???????c ????? tr???ng</Text>)
                        }
                        <TextInput
                            placeholder={"Nh???p t??n kh??a h???c"}
                            style={stylesCreateCourse.txtInput}
                            value={this.state.course.tenKhoa}
                            onChangeText={(value) => {
                                this.onValidateTextKhoa(value.trim())
                                this.setState(prevProps => ({
                                    course: {
                                        ...prevProps.course,
                                        tenKhoa: value
                                    }
                                }))
                            }}
                        />


                        <Text style={stylesCreateCourse.txtStyleBasic}>Gi???ng vi??n</Text>
                        {/* Validate */}
                        {(this.state.validate.show && this.state.validate.giangVien) && (
                            <Text style={stylesCreateCourse.txtValidate}>* T??n gi???ng vi??n kh??ng ???????c ????? tr???ng</Text>)
                        }
                        <TextInput
                            placeholder={"Nh???p t??n gi???ng vi??n"}
                            style={stylesCreateCourse.txtInput}
                            value={this.state.course.giangVien}
                            onChangeText={(value) => {
                                this.onValidateTextGiangVien(value.trim())
                                this.setState(prevProps => ({
                                    course: {
                                        ...prevProps.course,
                                        giangVien: value
                                    }
                                }))
                            }}
                        />


                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ flex: 1, marginRight: Sizes.s30 }}>

                                <SelectedDate
                                    value={this.state.course.dateStart}
                                    title={"T??? ng??y"}
                                    placeholder={editCourse == "true"
                                        ? moment(this.state.course.dateStart).format('DD/MM/YYYY')
                                        : "Ch???n ng??y b???t ?????u"}
                                    onChange={value => {
                                        let val = new Date(Date.parse(value));

                                        var dStart = new Date();
                                        dStart.setFullYear(val.getFullYear(), val.getMonth(), val.getDate());
                                        var dEnd = new Date();
                                        console.log(dStart,value);
                                        console.log(dStart,this.state.course.dateEnd);
                                        
                                        if (dStart > dEnd) {
                                           
                                            this.setState(prevProps => ({
                                                course: {
                                                    ...prevProps.course,
                                                    dateStart: val
                                                },
                                                validate: {
                                                    ...prevProps.validate,
                                                    ngayKetThuc: true
                                                },
                                                errorMessageEndDay: true
                                            }), () => console.log("DOne"))
                                        }
                                        else {
                                            this.setState(prevProps => ({

                                                course: {
                                                    ...prevProps.course,
                                                    dateStart: val
                                                }
                                            }))
                                        }


                                    }


                                    }
                                    onValidate={() => {
                                        this.setState(prevProps => ({
                                            validate: {
                                                ...prevProps.validate,
                                                ngayBatDau: false
                                            }
                                        }))
                                    }}
                                    // maximumdate={this.state.course.dateEnd}  
                                    mode="date"
                                    display="default"
                                />
                                {/* Validate */}
                                {(this.state.validate.show && this.state.validate.ngayBatDau) && (
                                    <Text style={stylesCreateCourse.txtValidate}>* Ch??a ch???n ng??y</Text>)
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                <SelectedDate
                                    value={this.state.course.dateEnd}
                                    title={"?????n ng??y"}
                                    placeholder={
                                        editCourse == "true" ?
                                            moment(this.state.course.dateEnd).format('DD/MM/YYYY') :
                                            "Ch???n ng??y k???t th??c"
                                    }
                                    onChange={value => {
                                        console.log(this.state.course.dateStart)
                                        let val = new Date(Date.parse(value));

                                        var dStart = new Date();
                                        var dEnd = new Date();
                                        dEnd.setFullYear(val.getFullYear(), val.getMonth(), val.getDay());

                                        dStart.setFullYear(this.state.course.dateStart.getFullYear(), this.state.course.dateStart.getMonth(), this.state.course.dateStart.getDay());
                                        if (dStart > dEnd) {
                                            this.setState(prevProps => ({
                                                course: {
                                                    ...prevProps.course,
                                                    dateEnd: val
                                                },
                                                validate: {
                                                    ...prevProps.validate,
                                                    ngayKetThuc: true
                                                },
                                                errorMessageEndDay: true
                                            }), () => console.log("DOne"))
                                        }
                                        else {

                                            this.setState(prevProps => ({

                                                course: {
                                                    ...prevProps.course,
                                                    dateEnd: val
                                                },
                                                errorMessageEndDay: false
                                            }))
                                        }

                                    }


                                    }
                                    onValidate={() => {
                                        this.setState(prevProps => ({
                                            validate: {
                                                ...prevProps.validate,
                                                ngayKetThuc: false
                                            }
                                        }))
                                    }}
                                    minimumdate={this.state.course.dateStart}
                                    mode="date"
                                    display="default"
                                />
                                {/* Validate */}
                                {(this.state.validate.show && this.state.validate.ngayKetThuc) && (
                                    <Text style={stylesCreateCourse.txtValidate}> {this.state.errorMessageEndDay == true ? "* Ng??y k???t th??c ph???i l???n h??n" : "* Ch??a ch???n ng??y"}</Text>)
                                }
                            </View>
                        </View>
                        <Text style={[stylesCreateCourse.txtStyleBasic, { marginBottom: 0 }]}>T??a nh??</Text>
                        {/* Validate */}
                        {(this.state.validate.show && this.state.validate.toaNha) && (
                            <Text style={stylesCreateCourse.txtValidate}>* Ch??a ch???n t??a nh??</Text>)
                        }
                        <PickerItem
                            noDataMessage={"Ko fetch data t??a nh?? dc"}
                            data={dataToaNha}
                            title={"Danh s??ch t??a nh??"}
                            placeholder={"Ch???n t??a nh??"}
                            position={"flex-end"}
                            defaultItem={this.state.course.toaNha}
                            value={
                                this.state.course.toaNha.id
                            }
                            onChangeItem={async (value) => {

                                await this.onValidateToaNha()
                                // alert(this.state.course.phongHoc)
                                // T???o m???ng ph??ng h???c t????ng ???ng v???i t???ng t??a nh?? 
                                let idToaNha = value.id
                                let dataPhongHoc = (idToaNha) => {
                                    for (let i = 0; i < this.state.dataBuilding.toaNhaPhongHoc.length; i++) {
                                        if (this.state.dataBuilding.toaNhaPhongHoc[i].id == idToaNha) {
                                            return this.state.dataBuilding.toaNhaPhongHoc[i]
                                        }
                                    }
                                }
                                await this.setState(prevProps => ({
                                    dataBuilding: {
                                        ...prevProps.dataBuilding,
                                        phongHoc: dataPhongHoc(idToaNha).value
                                    },
                                    course: {
                                        ...prevProps.course,
                                        phongHoc: "",
                                        toaNha: value
                                    },
                                    validate: {
                                        ...prevProps.validate,
                                        phong: true
                                    }
                                }))
                            }}
                        />


                        <Text style={[stylesCreateCourse.txtStyleBasic, { marginTop: Sizes.s10, marginBottom: 0 }]}>Ph??ng</Text>
                        {/* Validate */}
                        {(this.state.validate.show && this.state.validate.phong) && (
                            <Text style={stylesCreateCourse.txtValidate}>* Ch??a ch???n ph??ng</Text>)
                        }
                        <PickerItem
                            data={this.state.dataBuilding.phongHoc}
                            noDataMessage={"Ko fetch data ph??ng h???c dc"}
                            title={"Danh s??ch ph??ng h???c"}
                            position={"flex-end"}
                            placeholder={"Ch???n ph??ng h???c"}
                            defaultItem={this.state.course.phongHoc}
                            onChangeItem={async (value) => {
                                await this.setState(prevProps => ({
                                    course: {
                                        ...prevProps.course,
                                        phongHoc: value
                                    }
                                }))
                                // console.log("phong hoc", this.state.course.phongHoc)
                                this.onValidatePhongHoc()
                            }}
                            value={this.state.course.phongHoc.label}
                            style={{ marginBottom: Sizes.s2 }}
                        />

                        <TouchableOpacity
                            style={stylesCreateCourse.btnSave}
                            onPress={() => {


                                // alert(this.checkValidate())
                                if (
                                    // this.state.validate.show == false &&
                                    this.state.validate.khoa == false &&
                                    this.state.validate.giangVien == false &&
                                    this.state.validate.ngayBatDau == false &&
                                    this.state.validate.ngayKetThuc == false &&
                                    this.state.validate.toaNha == false &&
                                    this.state.validate.phong == false) {

                                    Alert.alert(
                                        JSON.stringify(this.props.navigation.getParam("editCourse", "false")) == "true" ? "C???p nh???t kh??a h???c" : "T???o m???i kh??a h???c",
                                        JSON.stringify(this.props.navigation.getParam("editCourse", "false")) == "true" ? "B???n mu???n c???p nh???t kh??a h???c" : "B???n mu???n t???o kh??a h???c",
                                        [
                                            { text: "H???y b???" },
                                            {
                                                text: "?????ng ??",
                                                onPress: async () => {
                                                    console.log(JSON.stringify(this.state.validate))
                                                    const newCourse = {
                                                        courseName: this.state.course.tenKhoa.trim(),
                                                        trainer: this.state.course.giangVien.trim(),
                                                        startedDate: this.state.course.dateStart,
                                                        endedDate: this.state.course.dateEnd,
                                                        buildingId: this.state.course.toaNha.id,
                                                        roomId: this.state.course.phongHoc.id,
                                                    }
                                                    if (JSON.stringify(this.props.navigation.getParam("editCourse", "false")) == "true") {
                                                        newCourse.courseId = courseId
                                                        this.props.editCourseAction(
                                                            tokenUser,
                                                            newCourse
                                                        )
                                                    } else {
                                                        this.props.addCourseAction(
                                                            tokenUser,
                                                            newCourse
                                                        )
                                                    }
                                                    await this.props.courseAction(tokenUser)
                                                    await this.props.navigation.goBack()
                                                }
                                            }
                                        ],
                                        { cancelable: false }
                                    )
                                } else {
                                    this.setState(prevProps => ({
                                        validate: {
                                            ...prevProps.validate,
                                            show: true
                                        }
                                    }))
                                }
                            }}
                        >
                            <FontAwesome name={"save"} size={16} color={"#fff"} />
                            <Text
                                style={{ color: "#fff", fontWeight: "bold", marginLeft: 8 }}
                            >L??u</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
    }
}

// Update state object 
// https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react

// Get value ftoom custom component
// https://stackoverflow.com/questions/64134105/react-how-do-i-get-the-value-of-a-custom-textinput-component