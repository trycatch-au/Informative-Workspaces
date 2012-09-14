<form>
    <div class="fieldcontain">
        <label>Component</label>
        <select class="componentChoice">
            <% _.forEach(components, function(component) { %>
                <option value="<%= component %>"><%= component %></option>
            <% }) %>
        </select>
    </div>

    <div class="fieldcontain">
        <label>Environment</label>
        <select class="environmentChoice">
            <% _.forEach(environments, function(env) { %>
                <option value="<%= env %>"><%= env %></option>
            <% }) %>
        </select>
    </div>

</form>
