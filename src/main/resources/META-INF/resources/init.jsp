<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui" %>
<%@ taglib uri="http://liferay.com/tld/portlet" prefix="liferay-portlet" %>
<%@ taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %>
<%@ taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>

<%@ page import="highlightedrecommendationportlet.configuration.HighlightedRecommendationConfiguration" %>
<%@ page import="com.liferay.portal.kernel.util.GetterUtil" %>
<%@ page import="com.liferay.portal.kernel.util.StringPool" %>
<%@ page import="com.liferay.portal.kernel.util.Validator" %>

<liferay-theme:defineObjects />

<portlet:defineObjects />

<%
String mainRequire = (String)renderRequest.getAttribute("mainRequire");
HighlightedRecommendationConfiguration configuration =
    (HighlightedRecommendationConfiguration)
    renderRequest.getAttribute(HighlightedRecommendationConfiguration.class.getName());

    String articleToRecommend = StringPool.BLANK;

    if (Validator.isNotNull(configuration)) {
        articleToRecommend =
            portletPreferences.getValue(
                "articleToRecommend", configuration.articleToRecommend());
    }
%>