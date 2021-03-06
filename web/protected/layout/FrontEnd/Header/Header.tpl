<div class="top-head">
	<div class="container">
		<nav class="navbar navbar-default" role="navigation">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#top-menu-div">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="/" id="logo" title="<%= $this->getPage()->getAppName() %>"></a>
			</div>
			<div class="collapse navbar-collapse" id="top-menu-div">
				<ul class="nav navbar-nav navbar-right top-menu" >
					<li><a href="/#header">Home</a></li>
					<li><a href="/wordlist.html">Word List</a></li>
					<li><a href="/#contactus">Contact</a></li>
					<li><a href="/career.html">Career</a></li>
					<li><a href="/help.html">Help</a></li>
				</ul>
			</div>
		</nav>
	</div>
</div>
<div class="top-bar clearfix" <%= Core::getUser() instanceof UserAccount ? 'style="background: #eee; margin-bottom: 10px;"' : '' %>>
	<div class="container">
       <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
       </div><!-- end columns -->
       <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12 user-menu-bar" >
       	   <com:TPanel ID="user_menu_not_login" CssClass="top-bar-menu pull-right hidden">
      	   		<ul class="nav nav-pills" role="tablist">
      	   			<li><a href="/login.html"><i class="fa fa-user"></i> Admin Login</a></li>
      	   		</ul>
           </com:TPanel><!-- end top-bar-menu -->
       	   <com:TPanel ID="user_menu_login" CssClass="top-bar-menu pull-right" Visible='false'>
      	   		<ul class="nav nav-pills" role="tablist">
      	   			<li><a href="/backend.html" title="Home"><i class="glyphicon glyphicon-home"></i><span class="hidden-xs hidden-sm"> Home</span></a></li>
      	   			<li><a href="/backend/word/new.html" title="Word Creation"><i class="fa fa-caret-square-o-right"></i><span class="hidden-xs hidden-sm"> Word Creation</span></a></li>
      	   			<li class="dropdown visible-xs visible-md visible-sm visible-lg">
      	   				<a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-cog"></i><span class="hidden-xs hidden-sm"> <%= Core::getUser()->getPerson()->getFirstName() %></span><span class="caret"></span></a>
      	   				<ul class="dropdown-menu" role="menu">
							<li><a href="/logout.html"><i class="fa fa-sign-out"></i>Logout</a></li>
						</ul>
      	   			</li>
      	   		</ul>
           </com:TPanel><!-- end top-bar-menu -->
       </div><!-- end columns -->
   </div>
</div>
<div class="banner-wrapper">
	
</div>
