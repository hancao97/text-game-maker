# 文字冒险游戏开发引擎（markdown）

## 功能
- 文字冒险游戏单元代码段补全，输入gameUnit补全以下内容：

> @unitStart  
id:  唯一标识(当id为0代表为初始节点，id不能重复且初始节点必须存在)  
name:  名称  
font-color:  字体颜色（默认白色）  
text:  文字内容  
next:  可选（代表本画面没有分支）  
background-color:  画面背景颜色（默认黑色）  
@unitOptionStart  
text: 可多个，本选项的描述  
next: 可多个，本选项的下一个节点  
text: 可多个，本选项的描述  
next: 可多个，本选项的下一个节点  
@unitOptionEnd  

- markdown 打包为游戏 html

选择目录或者 md 文件，将目录下属所有 markdown 打包成游戏静态 h5 页面

## 待办

- 支持背景图片
- 支持配置音频文件
- 文字动效

## 寒草

寒草微信：hancao97, 欢迎加好友一起交流  

个人博客：https://hancao97.github.io/  
掘金：https://juejin.cn/user/703340610597064/posts








