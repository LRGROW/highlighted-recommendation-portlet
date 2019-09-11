package highlightedrecommendationportlet.configuration;

import java.util.Map;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletConfig;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

import highlightedrecommendationportlet.configuration.HighlightedRecommendationConfiguration;
import highlightedrecommendationportlet.constants.HighlightedRecommendationPortletKeys;
import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.portal.kernel.configuration.Configuration;
import com.liferay.portal.kernel.portlet.ConfigurationAction;
import com.liferay.portal.kernel.portlet.DefaultConfigurationAction;
import com.liferay.portal.kernel.util.ParamUtil;

@Component(configurationPid = "highlightedrecommendationportlet.configuration.HighlightedRecommendationConfiguration", configurationPolicy = ConfigurationPolicy.OPTIONAL, immediate = true, property = {
        "javax.portlet.name="
                + HighlightedRecommendationPortletKeys.HighlightedRecommendation }, service = ConfigurationAction.class)
public class HighlightedRecommendationConfigurationAction extends DefaultConfigurationAction {

    /**
     * getJspPath: Return the path to our configuration jsp file.
     * 
     * @param request The servlet request.
     * @return String The path
     */
    @Override
    public String getJspPath(HttpServletRequest request) {
        return "/configuration.jsp";
    }

    @Override
    public void processAction(PortletConfig portletConfig, ActionRequest actionRequest, ActionResponse actionResponse)
            throws Exception {

        String articleToRecommend = ParamUtil.getString(actionRequest, "articleToRecommend");

        setPreference(actionRequest, "articleToRecommend", articleToRecommend);

        super.processAction(portletConfig, actionRequest, actionResponse);
    }

    @Override
    public void include(PortletConfig portletConfig, HttpServletRequest httpServletRequest,
            HttpServletResponse httpServletResponse) throws Exception {

        httpServletRequest.setAttribute(HighlightedRecommendationConfiguration.class.getName(), _configuration);

        super.include(portletConfig, httpServletRequest, httpServletResponse);
    }

    @Activate
    @Modified
    protected void activate(Map<Object, Object> properties) {
        _configuration = ConfigurableUtil.createConfigurable(
            HighlightedRecommendationConfiguration.class, properties);
    }

    private volatile HighlightedRecommendationConfiguration _configuration;

    /**
	 * setServletContext: Sets the servlet context, use your portlet's bnd.bnd Bundle-SymbolicName value.
	 * @param servletContext The servlet context to use.
	 */
	@Override
	@Reference(
		target = "(osgi.web.symbolicname=highlightedrecommendationportlet)",
		unbind = "-"
	)
	public void setServletContext(ServletContext servletContext) {
		super.setServletContext(servletContext);
	}
}