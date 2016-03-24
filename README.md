## 期待您使用或改进 MobSlider
------
### 简介
MobSlider是我为了移动端的轮播（支持PC）而制作的基于jQuery的插件,你可以基于此制作出符合各种要求的轮播效果。

### 现有及待更新的功能
- [x] 基于Touch\Move事件的轮播效果
- [ ] 自动滚动轮播
- [ ] 自定义轮播位置点

### 使用方式
在使用前你需要引用对应的**css样式文件**以及**js文件**

```
<!-- 加载样式文件 -->
    <link rel="stylesheet" type="text/css" href="css/MobSlider.min.css">
    <script src="jquery.min.js"></script>
<!-- 加载 MobSlider JS -->
    <script src="js/MobSlider.min.js"></script>
<!-- 使用 -->
<div id="MobSlider">
	<li style="background-image: url(xxx);"></li>
	<li style="background-image: url(xxx);"></li>
	<li style="background-image: url(xxx);"></li>
</div>
<!-- 注册 -->
<script>
	$(document).ready(function(){
		MobSlider.MSEntry($('#MobSlider'));
	});
</script>
```
#### 使用注意
> li内的内容,请自行修改.
> 但请务必记得给li添加背景图片.