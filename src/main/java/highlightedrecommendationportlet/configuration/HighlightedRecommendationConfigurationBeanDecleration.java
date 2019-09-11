package highlightedrecommendationportlet.configuration;

import com.liferay.portal.kernel.settings.definition.ConfigurationBeanDeclaration;

import org.osgi.service.component.annotations.Component;

@Component
public class HighlightedRecommendationConfigurationBeanDecleration
    implements ConfigurationBeanDeclaration {

    @Override
    public Class<?> getConfigurationBeanClass() {
        return HighlightedRecommendationConfiguration.class;
    }
}