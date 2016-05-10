package com.vacomall.app.agent.general;

import com.facebook.react.ReactActivity;
import cn.reactnative.modules.update.UpdatePackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;
import cn.reactnative.modules.update.UpdateContext;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "vacomall";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }
    @Override
    protected String getJSBundleFile() {
        return UpdateContext.getBundleUrl(this);
    }
    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new UpdatePackage()
        );
    }
}
