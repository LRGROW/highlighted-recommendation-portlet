package highlightedrecommendationportlet.portlet;

import highlightedrecommendationportlet.configuration.HighlightedRecommendationConfiguration;
import highlightedrecommendationportlet.constants.HighlightedRecommendationPortletKeys;

import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.frontend.js.loader.modules.extender.npm.NPMResolver;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.theme.PortletDisplay;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.WebKeys;

import java.io.IOException;
import java.util.Map;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

/**
 * @author rolandpakai
 */
@Component(
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.header-portlet-css=/css/index.css",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.name=" + HighlightedRecommendationPortletKeys.HighlightedRecommendation,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user"
	},
	service = Portlet.class
)
public class HighlightedRecommendationPortlet extends MVCPortlet {

	@Override
	public void doView(
			RenderRequest renderRequest, RenderResponse renderResponse)
		throws IOException, PortletException {

		renderRequest.setAttribute(
			"mainRequire",
			_npmResolver.resolveModuleName("HighlightedRecommendationPortlet") + " as main");

			ThemeDisplay themeDisplay = (ThemeDisplay)renderRequest.getAttribute(
				WebKeys.THEME_DISPLAY);
	
			PortletDisplay portletDisplay = themeDisplay.getPortletDisplay();
	
			try{
				_configuration = portletDisplay.getPortletInstanceConfiguration(
					HighlightedRecommendationConfiguration.class);
			}
			catch(Exception e){
			}
			finally {
			renderRequest.setAttribute(
				HighlightedRecommendationConfiguration.class.getName(), _configuration);
			}
	
			super.doView(renderRequest, renderResponse);
		}
	
		public Object articleToRecommend(Map config) {
			return config.get(_configuration.articleToRecommend());
		}

		@Activate
		@Modified
		protected void activate(Map<String, Object> properties) {
			_configuration = ConfigurableUtil.createConfigurable(
				HighlightedRecommendationConfiguration.class, properties);
		}
	
		@Reference
		private NPMResolver _npmResolver;
	
		private volatile HighlightedRecommendationConfiguration _configuration;
	
	}