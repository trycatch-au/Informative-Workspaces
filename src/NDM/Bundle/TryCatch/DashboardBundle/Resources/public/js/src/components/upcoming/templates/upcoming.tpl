<div class="row-fluid">
	<div class="span6 nextReleaseDate">
		<div><small style="display: block;">Next <%= componentName[0].toUpperCase() +  componentName.substr(1) %> Release</small></div>
		<h1><%= release.get('name') %></h1>
	</div>
	<div class="span6">
		<div class="counter">
			<h2>Freeze:</h2>
			<time id="counter-codeFreeze"><%= release.get('dates').codeFreeze.format('yyyy/mm/dd') %></time>
		</div>
		<div class="counter">
			<h2>Release:</h2>
			<time id="counter-release"><%= release.get('dates').release.format('yyyy/mm/dd') %></time>
		</div>
	</div>
</div>
