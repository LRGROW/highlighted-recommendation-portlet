<%@ include file="/init.jsp" %>

<div id="<portlet:namespace />-root"></div>

<aui:script require="<%= mainRequire %>">
	var articleToRecommend = "<%= articleToRecommend %>"
	main.default('<portlet:namespace />-root', articleToRecommend);
</aui:script>