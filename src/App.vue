<template>
	<div id="app">
		<div>
		    <a href="{{item.url}}" class="kb-card " v-for="item in newsList">
		      <div class="kb-item-content base-flex-box sim2-style ">
		        <div class="sim2-content-wrap base-flex1">
		          <div class="kb-title base-line2 sim2-text">{{item.title}}</div>
		          <div class="bottom-wrap">
		            <div class="bottom-content">
		              
		              <div class="kb-span kb-chlname">{{item.chlname}}</div>
		              
		            </div>
		          </div>
		        </div>
		        <div class="sim-image-wrap kb-image-box">
		          <image class="kb-img-center" mode="aspectFill" src="{{item.thumbnails}}"></image>
		        </div>
		      </div>
		    </a>
		</div>
		<div class="kb-bottom-lod-wrap">
		      <img class="kb-loading-image"  src="http://mat1.gtimg.com/www/images/newsapp/wxapp/kuaibao/global_detail_loading.gif"></img>
		      <!-- <div class="kb-bottom-nomore" >都看完了，试试别的频道吧</div> -->
		</div>
	</div>
</template>

<script>
	import simpleGrid from './components/SimpleGrid.vue'
	import $ from 'n-zepto'
	import {fetch,getQueryString} from "./assets/util.js";

	export default {
		data() {
			return {
				newsList:[],
				_lock: false,
				testapi: false,
				searchQuery: '',
				openid: '',
				timestamp:'',
				last_time:''
			}
		},
		components: {
			simpleGrid
		},
		computed: {},
		methods: {
			getData: function(type){
				var me = this;

				if(me._lock){
					return
				}
				me._lock = true;
				var api = 'https://twxapp.cnews.qq.com/getSubNewsInterest?chlid=wxapp_kb_tl&';

				var para = {
					openid: me.openid,
					last_time: me.last_time
				};

				if(type == 'init'){
					para.forward = 0;
					me.newslist = [];
				}else{
					para.forward = 0;
				}
				
				fetch(api,para).then(function(d){
					console.log(d);
					me._lock = false;
					if(d.newslist && d.newslist.length>0){
						me.last_time = d.timestamp;
						me.newsList = me.newsList.concat(d.newslist);
						try{
							var cache = JSON.stringify(me.newsList);
							sessionStorage.setItem('cache',cache);
						}catch(e){
							console.log(e);
						}
					}else{
						alert('没有更多新闻')
					}
				},function(){
					alert('请求失败')
					me._lock = true;
				})
			},
			listenEvent: function(){
				var me = this;
				var screenHeight = $(window).height();
				var $window = $(window);
				var preLoadHeight = 10;
				$window.scroll(function(){
					var scrollTop = $window.scrollTop();
					if( scrollTop > $('#app').height()-screenHeight-preLoadHeight){
						me.getData();
					}
				})
			},
			switchApi: function(){
				this.testapi = !this.testapi;
				this.getData('init');
			}
		},
		init: function(){
			
		},
		created: function(){
			var me = this;

			me.openid = getQueryString('openid');

			var cache = sessionStorage.getItem('cache');
			if(cache){
				try{
					var obj = JSON.parse(cache);
					this.newsList = obj;
				}catch(e){
					console.log(e)
				}
			}else{
				me.getData('init');
			}
			
		},
		ready: function(){
			this.listenEvent();
		}
	}
</script>
<style>
	@import url("./assets/app.css");
	@import url("./assets/index.css");
</style>