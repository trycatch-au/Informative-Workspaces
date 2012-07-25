<h2>Incidents</h2>
<table class="componentList table table-bordered table-striped">
	<tbody>
		<% _.forEach(issues, function(issue) { %>
		<tr>
			<th>
				<span class="priority label label-<%= issue.getPriorityString() %>"><%= issue.getPriority() %></span>
			</th>
			<th>
				<%= issue.getName() %>
			</th>
		</tr>
		<% }); %>
	</tbody>

</table>