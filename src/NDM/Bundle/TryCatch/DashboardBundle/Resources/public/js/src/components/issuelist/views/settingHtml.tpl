<form>
    <div class="fieldcontain">
        <label>Component</label>
        <select id="componentChoice" multiple="true">
            <% _.forEach(components, function(component) { %>
                <option value="<%= component %>"><%= component %></option>
            <% }) %>
        </select>
    </div>

    <div class="fieldcontain">
        <label>Environment</label>
        <select id="environmentChoice" multiple="true">
            <% _.forEach(environments, function(env) { %>
                <option value="<%= env %>"><%= env %></option>
            <% }) %>
        </select>
    </div>

</form>
