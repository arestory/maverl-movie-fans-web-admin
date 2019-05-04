

//var host ="http://212.64.93.216:7777"
var host ="http://localhost:7575"
var getQuestionListPath = "/question/list/" 
var updateQuestionPath = "/question/update/" 
var filePath = "http://212.64.93.216:8000/file/" 
console.log($(window).width());
windowWidth = $(window).width();
if(windowWidth>1200){
    windowWidth=1200;
}
imageWidth=(windowWidth-40)+"px"
imageHeight=(windowWidth*9/16)+"px"
editBtnStyle = "margin-left:"+(windowWidth-100-40)+"px;width:100px"
window.onresize= function(){
 
    app.windowWidth= $(window).width();
    if(app.windowWidth>1200){
        app.windowWidth=1200;
    }

    app.imageWidth=  (app.windowWidth-40)+"px"
    app.imageHeight=(   app.imageWidth*9/16)+"px"
    app.editBtnStyle="margin-left:"+(app.windowWidth-100-40)+"px;width:100px"
}
var app =new Vue({

    el: "#app",
    data:{
        currentPage:1,
        isLoadMoreFinish:true,
        hadNoMoreItems:false,
        chooseFileBtnText:"选择文件",
        items: [],   
        item:{

           
        },
        editBtnStyle:editBtnStyle,
        windowWidth:windowWidth,
        imageWidth:imageWidth,
        imageHeight:imageHeight,
        currentQuestion:{
            type:"image"
        },
        uploadUrl:"http://212.64.93.216:7777/question/upload",
 
        updateQuestion:function(questionId){

            var title = $("#titleUpdateInput").val();
            var keywords = $("#keywordUpdateInput").val();
            var point = $("#pointUpdateInput").val();
            var answer = $("#answerUpdateInput").val();
            if(title.length==0){

                alert('标题不能为空');
                return;
            }
            if(keywords.length!=21){
        
                alert('关键字长度只能为21个');
                return;
            }
            if(point.length==0){
        
                alert('分数不能为空');
                return;
            } 
            if(point<=0){
        
                alert('分数不能小于等于0');
                return;
            } 
            if(answer.length==0){
        
                alert('答案不能为空');
                return;
            }
        
            var json  = {
 
                title:title,
                keywords:keywords,
                point:point,
                answer:answer 
            };
            console.log(json)
            $.ajax({
                type: "post",
                url:host+updateQuestionPath+questionId, 
                data:json,
                dataType: 'json',
                success:function(res){
        
                    console.log(res);
                    if(res['code']==200){

                        var inst = new mdui.Dialog('#question-dialog');
                        inst.close();
                        var index = app.items.indexOf(app.currentQuestion);
                        json['url'] = app.currentQuestion['url'];
                        json['id'] = app.currentQuestion['id'];
                        json['type'] = app.currentQuestion['type'];
                        app.items[index] = json;
                        app.currentQuestion= json;
                        //同步更新
                        Vue.set(app.items,index,json);

                    }

                    mdui.snackbar({
                        message: res['data']
                      });
        
                },
                error:function(e){
        
                    console.error(e);
        
                },
                complete:function(XMLHttpRequest, textStatus){
        
                    console.log("complete");
        
        
                }
            
            });


        },
        showQuestionUpdateDialog:function(question,index){

            app.currentQuestion = question; 
            var inst = new mdui.Dialog('#question-dialog');

            inst.open(); 

        },
        getQuestions:function(page){

            app.isLoadMoreFinish = false;
   

            app.currentPage = page;
            var url = host+getQuestionListPath+page+"/"+20;
            $.ajax(url, {
        
                method :"GET",
                success:function(data){
                    console.log(data);
                    app.isLoadMoreFinish = true; 
                    if(data['data']){
        
                        if(data['data'].length==0){
                            app.hadNoMoreItems = true;
                        }else{
                            var array = data['data'];
                            array.forEach(function(item,index){


                                item['url']=filePath+item['url'];
                              

                            });
                            app.items = app.items.concat(array);

                        }
                    }else{
                        app.hadNoMoreItems = true;
                    }
                    console.log(data['data']);
                    


        
                },
                error:function(e){
                          
                    console.log(e);
                    app.isLoadMoreFinish = true;
        
                  }  
            });


        },




    },

});

function chooseFile(){

    $("#chooseFileInput").click();

}

$("#chooseFileInput").change(function(){
 
    if($("#chooseFileInput").val()!=""){
        app.chooseFileBtnText = $("#chooseFileInput").val();
    }else{
        app.chooseFileBtnText ="未选择任何文件"
    }

});


function uploadQuestion(){


    if($("#chooseFileInput").val()==''){

        alert('未选择任何文件,请选择文件');
        return;
    }
    if($("#titleInput").val().length==0){

        alert('标题不能为空');
        return;
    }
    if($("#keywordInput").val().length!=21){

        alert('关键字长度只能为21个');
        return;
    }
    if($("#pointInput").val().length==0){

        alert('分数不能为空');
        return;
    } 
    if($("#pointInput").val()<=0){

        alert('分数不能小于等于0');
        return;
    } 
    if($("#answerInput").val().length==0){

        alert('答案不能为空');
        return;
    }

    $.ajax({
        type: "post",
        url:app.uploadUrl,
        data:$("#questionForm").serialize(),
        dataType: 'json',
        success:function(res){

            console.log(res);

        },
        error:function(e){

            console.error(e);

        },
        complete:function(XMLHttpRequest, textStatus){

            console.log("complete");


        }
    
    });



}
 function addQuestion(){

    var inst = new mdui.Dialog('#add-dialog');
              
    inst.open(); 

 }

app.getQuestions(app.currentPage);

$(window).scroll(function () {

    var viewHeight = 900; //可见高度 
    var windowWidth = $(window).width();
    var count = windowWidth / 200;//行数
    // console.log(app.items.length + 'hhh'  + windowWidth +'width' + count +"count");
    var contentHeight = (app.items.length % count == 0 ? app.items.length / count : app.items.length / count + 1) * 200
    
    // var contentHeight = $("#app").get(0).contentHeight; //内容高度  
    // var contentHeight = $("#app").

    var scrollHeight = $(window).scrollTop(); //滚动高度  
    // console.log("viewHeight:" + viewHeight + ",contentHeight:" + contentHeight + ",scrollHeight:" + scrollHeight);
    if (contentHeight-900-200  - scrollHeight <= 10) {
        // console.log('diaoyong')
         
            if(app.isLoadMoreFinish&&!app.hadNoMoreItems){
                
                app.getQuestions(app.currentPage+1);
                
            } 
    }
})

