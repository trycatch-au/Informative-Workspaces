<form>
    <div class="fieldcontain">
        <label>Component</label>
        <select class="componentChoice" multiple>
            <% _.forEach(components, function(component) { %>
                <option value="<%= component %>"><%= component %></option>
            <% }) %>
        </select>
    </div>

    <div class="fieldcontain">
        <label>Environment</label>
        <select class="environmentChoice" multiple>
            <% _.forEach(environments, function(env) { %>
                <option value="<%= env %>"><%= env %></option>
            <% }) %>
        </select>
    </div>

    <div class="fieldcontain">
        <label>Component Limit</label>
        <input type="text" id="componentLimit" value="10" />
    </div>
</form>
