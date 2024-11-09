'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">BusBuddy Frontend Documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AddRouteModalComponent.html" data-type="entity-link" >AddRouteModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddStopModalComponent.html" data-type="entity-link" >AddStopModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BusdriversComponent.html" data-type="entity-link" >BusdriversComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BusRoutesComponent.html" data-type="entity-link" >BusRoutesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CancelledDeploymentModalComponent.html" data-type="entity-link" >CancelledDeploymentModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangeDriverModalComponent.html" data-type="entity-link" >ChangeDriverModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmCancelDeploymentModalComponent.html" data-type="entity-link" >ConfirmCancelDeploymentModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DefaultDriverLayoutComponent.html" data-type="entity-link" >DefaultDriverLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DefaultFooterComponent.html" data-type="entity-link" >DefaultFooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DefaultHeaderComponent.html" data-type="entity-link" >DefaultHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DefaultManagerLayoutComponent.html" data-type="entity-link" >DefaultManagerLayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteRouteModalComponent.html" data-type="entity-link" >DeleteRouteModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteStopModalComponent.html" data-type="entity-link" >DeleteStopModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeploymentComponent.html" data-type="entity-link" >DeploymentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DriverHistoryModalComponent.html" data-type="entity-link" >DriverHistoryModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DrivingHistoryComponent.html" data-type="entity-link" >DrivingHistoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditRouteModalComponent.html" data-type="entity-link" >EditRouteModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogoutComponent.html" data-type="entity-link" >LogoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewDeploymentModalComponent.html" data-type="entity-link" >NewDeploymentModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/OverviewComponent.html" data-type="entity-link" >OverviewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Page404Component.html" data-type="entity-link" >Page404Component</a>
                            </li>
                            <li class="link">
                                <a href="components/Page500Component.html" data-type="entity-link" >Page500Component</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RequestComponent.html" data-type="entity-link" >RequestComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Account.html" data-type="entity-link" >Account</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});