<template>
    <div class="login-wrap">
        <!-- 背景星星 -->
        <div id="starsBox" ref="starsBox">
            <span v-for="star in starsStyle" :style="{
                width: star.width,
                height: star.height,
                top: star.top,
                left: star.left,
                background: star.background,
                boxShadow: star.boxShadow}"></span>
        </div>
        <!-- 背景猫 -->
        <Cat class="cat"></Cat>
        <div class="ms-title">3D Resource System</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery'
    import Cat from '@/components/common/catAnimation/catAnimation'
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: 'admin',
                    password: '123123'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                colors: ['#f5d76e','#f7ca18','#f4d03f','#ececec','#ecf0f1','#a2ded0'],
                stars: 250
            }
        },
        components: {
            Cat
        },
        mounted() {
            setTimeout(function(){ 
                $('#starsBox span').each(function(){  
                    $(this).css('top', Math.random()*100 + '%').css('left', Math.random()*100 + '%'); 
              });
            }, 1);

            setInterval(function(){ 
                $('#starsBox span').each(function(){    
                    $(this).css('top', Math.random()*100 + '%').css('left', Math.random()*100 + '%'); 
              });
            }, 100000);  
        },
        computed: {
           starsStyle() {
                let starArr = []
                for (let i = 0; i <= this.stars; i++) {
                    const size = Math.random()*3;
                    const color = this.colors[parseInt(Math.random()*4)];
                    starArr.push({
                        width: size + 'px',
                        height: size + 'px',
                        top: Math.random()*100 + '%',
                        left: Math.random()*100 + '%',
                        background: color,
                        boxShadow: '0 0 '+ Math.random()*10 +'px' + color
                    })  
                }                   
                return starArr;         
           } 
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username',this.ruleForm.username);
                        this.$router.push('/');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
         background: #22313f;
    }
    .ms-title{
        position: absolute;
        top:12%;
        width:100%;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
       position: absolute;
        left: calc(50% - 190px);
        top: 20%;
        width: 300px;
        height: calc(50%);
        padding: 40px;
        background: rgba(255,255,255,0.05);
        border-top: 2px solid rgba(0,200,150,0.5);
        display: table;
        box-shadow: 0 0 20px 5px rgba(0,0,0,0.3)
    }
    .ms-login form{
        display: table-cell;
        vertical-align: middle;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
    /*星星背景样式*/
    #starsBox {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      opacity: .5;
    }
    #starsBox span {
      display: inline-block;
      width: auto;
      position: absolute;
      border-radius: 100%;
      transition: 100s linear;
    }
    .login-wrap .cat {
        position: absolute;
        right: 0;
        bottom: 0;
    }

</style>