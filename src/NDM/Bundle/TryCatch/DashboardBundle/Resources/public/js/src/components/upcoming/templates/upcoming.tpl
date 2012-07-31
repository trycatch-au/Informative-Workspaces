<div class="row-fluid">
	<div class="span6 nextReleaseDate">
		<div><small style="display: block;">Next Release</small></div>
		<h1><%= release.get('name') %></h1>
	</div>
	<div class="span6">
		<div class="counter">
			<h2>Code Freeze:</h2>
			<time id="counter-codeFreeze"><%= release.get('dates').codeFreeze %></time>
		</div>
		<div class="counter">
			<h2>In Production:</h2>
			<time id="counter-release"><%= release.get('dates').release %></time>
		</div>
	</div>
</div>
