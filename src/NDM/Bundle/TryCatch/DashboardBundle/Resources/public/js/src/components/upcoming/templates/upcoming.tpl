<div class="row-fluid">
	<div class="span6">
		<div><small style="display: block;">Next Release</small></div>
		<h1><%= release.get('name') %></h1>
	</div>
	<div class="span6">
		<div class="well">
			<h2>Code Freeze: <%= release.get('dates').codeFreeze %></h2>
		</div>
		<div class="well">
			<h2>Release: <%= release.get('dates').codeFreeze %></h2>
		</div>
	</div>
</div>