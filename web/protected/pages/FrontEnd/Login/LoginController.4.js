var PageJs=new Class.create
PageJs.prototype=Object.extend(new FrontPageJs,{_ressultPanelId:"",_getLoadingPanel:function(){var e={}
return e.me=this,new Element("div",{"class":"row"}).update(e.me._getLoadingDiv())},login:function(e){var a={}
a.me=this,a.panel=$(e).up(".login-form"),a.panel.down(".msg-div").update(""),a.data=a.me._preSubmit(a.panel),a.data!==!1&&(a.me._signRandID(e),a.loadingDiv=a.me._getLoadingPanel(),a.me.postAjax(a.me.getCallbackId("login"),a.data,{onLoading:function(){jQuery("#"+e.id).button("loading"),$(a.me._ressultPanelId).insert({after:a.loadingDiv}).hide()},onSuccess:function(e,t){try{a.result=a.me.getResp(t,!1,!0),a.result.url&&(window.location=a.result.url)}catch(r){a.panel.down(".msg-div").update(a.me.getAlertBox(r).addClassName("alert-danger"))}},onComplete:function(){jQuery("#"+e.id).button("reset"),a.loadingDiv.remove(),$(a.me._ressultPanelId).show()}},6e4))},_preSubmit:function(e){var a={}
return a.me=this,a.hasError=!1,a.usernamebox=e.down('[login-panel="email"]'),a.passwordbox=e.down('[login-panel="password"]'),a.errMsgDiv=new Element("div"),$F(a.usernamebox).blank()?(a.errMsgDiv.insert({bottom:a.me._getErrMsg("Please provide an email!")}),a.hasError=!0):null===$F(a.usernamebox).strip().match(/^.+@.+$/)&&(a.errMsgDiv.insert({bottom:a.me._getErrMsg("Please provide an valid email!")}),a.hasError=!0),$F(a.passwordbox).blank()&&(a.errMsgDiv.insert({bottom:a.me._getErrMsg("Please provide an password!")}),a.hasError=!0),a.hasError===!0?(e.down(".msg-div").update(a.errMsgDiv),!1):{email:$F(a.usernamebox).strip(),password:$F(a.passwordbox).strip()}},_getErrMsg:function(e){return new Element("div",{"class":"errmsg smalltxt text-danger"}).update(e)},_signUp:function(e){var a={}
return a.me=this,a.panel=$(e).up(".signup-form"),a.panel.down(".msg-div").update(""),a.emailBox=a.panel.down('[sigup-panel="email"]'),a.hasErr=!1,a.email=a.emailBox?$F(a.emailBox).strip():"",null===a.email.match(/^.+@.+$/)&&(a.panel.down(".msg-div").update(a.me._getErrMsg("Please provide an valid email!")),a.hasErr=!0),a.hasErr===!0?a.me:(a.me._signRandID(e),a.loadingDiv=a.me._getLoadingPanel(),a.me.postAjax(a.me.getCallbackId("signUp"),{email:a.email},{onLoading:function(){jQuery("#"+e.id).button("loading"),$(a.me._ressultPanelId).insert({after:a.loadingDiv}).hide()},onSuccess:function(e,t){try{if(a.result=a.me.getResp(t,!1,!0),!a.result||!a.result.confirmEmail)return
a.msg="<p>An email will be sent to <em><u>"+a.result.confirmEmail+"</u></em> with the initial password soon. Please use that to login and change the initial password after you logged in.</p>",a.panel.down(".msg-div").update(a.me.getAlertBox(a.msg).addClassName("alert-success")),a.emailBox.clear()}catch(r){a.panel.down(".msg-div").update(a.me.getAlertBox(r).addClassName("alert-danger"))}},onComplete:function(){jQuery("#"+e.id).button("reset"),a.loadingDiv.remove(),$(a.me._ressultPanelId).show()}},6e4),a.me)},_submtRetrievePass:function(e){var a={}
return a.me=this,a.panel=$(e).up(".pass-retrieve-panel"),a.panel.down(".msg-div").update(""),a.emailBox=a.panel.down('[pass-retrieve-panel="email"]'),a.hasErr=!1,a.email=a.emailBox?$F(a.emailBox).strip():"",null===a.email.match(/^.+@.+$/)&&(a.panel.down(".msg-div").update(a.me._getErrMsg("Please provide an valid email!")),a.hasErr=!0),a.hasErr===!0?a.me:(a.me._signRandID(e),a.loadingDiv=a.me._getLoadingPanel(),a.me.postAjax(a.me.getCallbackId("retrieve-pass"),{email:a.email},{onLoading:function(){jQuery("#"+e.id).button("loading"),$(a.me._ressultPanelId).insert({after:a.loadingDiv}).hide()},onSuccess:function(e,t){try{if(a.result=a.me.getResp(t,!1,!0),!a.result||!a.result)return
a.msg="<p>An email will be sent to <em><u>"+a.result.confirmEmail+"</u></em> with the initial password soon. Please use that to login and change the initial password after you logged in.</p>",a.panel.down(".msg-div").update(a.me.getAlertBox(a.msg).addClassName("alert-success")),a.emailBox.clear()}catch(r){a.panel.down(".msg-div").update(a.me.getAlertBox(r).addClassName("alert-danger"))}},onComplete:function(){jQuery("#"+e.id).button("reset"),a.loadingDiv.remove(),$(a.me._ressultPanelId).show()}},6e4),a.me)},showRetrievePassPanel:function(e){e===!0?(jQuery(".pass-retrieve-panel").show(),jQuery(".login-panel").hide()):(jQuery(".login-panel").show(),jQuery(".pass-retrieve-panel").hide())},init:function(e){var a={}
return a.me=this,a.me.jQueryFormSelector=e,jQuery(a.me.jQueryFormSelector).bootstrapValidator({message:"This value is not valid",feedbackIcons:{valid:"glyphicon glyphicon-ok",invalid:"glyphicon glyphicon-remove",validating:"glyphicon glyphicon-refresh"},fields:{login_email:{validators:{notEmpty:{message:"Your email is needed here"},emailAddress:{message:"The input is not a valid email address"}}},login_pass:{validators:{notEmpty:{message:"You password please."}}},signup_email:{validators:{notEmpty:{message:"We need to know your email address to sign you up."},emailAddress:{message:"The input is not a valid email address"}}},retrieve_pass_email:{validators:{notEmpty:{message:"Your email is needed here"},emailAddress:{message:"The input is not a valid email address"}}}}}).on("success.form.bv",function(e){e.preventDefault()}).on("error.field.bv",function(e,a){a.bv.disableSubmitButtons(!1)}).on("success.field.bv",function(e,a){a.bv.disableSubmitButtons(!1)}).on("keydown",".login-page-form[submit-btn]",function(e){a.element=jQuery(e.target),a.me.keydown(e,function(){jQuery(a.element.attr("submit-btn")).click()})}).on("click","#loginbtn",function(){jQuery(".panel .msg-div").html(""),jQuery.each(jQuery(".form-control"),function(e,t){jQuery(a.me.jQueryFormSelector).bootstrapValidator("enableFieldValidators",jQuery(t).attr("name"),jQuery(t).hasClass("login-form"))}),jQuery(a.me.jQueryFormSelector).bootstrapValidator("validate").data("bootstrapValidator").isValid()&&a.me.login($("loginbtn"))}).on("click","#signupbtn",function(){jQuery(".panel .msg-div").html(""),jQuery.each(jQuery(".form-control"),function(e,t){jQuery(a.me.jQueryFormSelector).bootstrapValidator("enableFieldValidators",jQuery(t).attr("name"),jQuery(t).hasClass("signup-form"))}),jQuery(a.me.jQueryFormSelector).bootstrapValidator("validate").data("bootstrapValidator").isValid()&&a.me._signUp($("signupbtn"))}).on("click","#retrievebtn",function(){jQuery(".panel .msg-div").html(""),jQuery.each(jQuery(".form-control"),function(e,t){jQuery(a.me.jQueryFormSelector).bootstrapValidator("enableFieldValidators",jQuery(t).attr("name"),jQuery(t).hasClass("retrieve-pass-form"))}),jQuery(a.me.jQueryFormSelector).bootstrapValidator("validate").data("bootstrapValidator").isValid()&&a.me._submtRetrievePass($("retrievebtn"))}),a.me}})