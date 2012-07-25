<table class="componentList table table-bordered table-striped">
	<thead>
		<tr>
			<th>Environments</th>
		<% _.forEach(environments, function(environment) { %>
			<th><%= environment.name %></th>
		<% }); %>
		</tr>
	</thead>
	<tbody>
		<% _.forEach(components, function(component) { %>
		<tr>
			<th>
				<%= component.get('name') %>
			</th>
			<% _.forEach(environments, function(environment){ %>
			<td>
				&nbsp; <%= component.getVersionForChannel(environment).get('version') %>
			</td>
			<% }); %>
		</tr>
		<% }); %>
	</tbody>

</table>