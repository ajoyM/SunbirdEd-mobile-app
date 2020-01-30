import { UpgradePopoverComponent } from './upgrade-popover.component';
import { PopoverController, Platform, NavParams } from '@ionic/angular';
import { UtilityService } from '../../../../services/utility-service';
import { Environment, ImpressionSubtype, ImpressionType, InteractSubtype, PageId, TelemetryGeneratorService } from '@app/services';
import { InteractType } from 'sunbird-sdk';
import { AppVersion } from '@ionic-native/app-version/ngx';

describe('UpgradePopoverComponent', () => {
    let upgradePopoverComponent: UpgradePopoverComponent;
    const mockUtilityService: Partial<UtilityService> = {
        openPlayStore: jest.fn()
    };
    const mockAppVersion: Partial<AppVersion> = {
        getAppName: jest.fn(() => Promise.resolve('some_string'))
    };
    const mockPopOverController: Partial<PopoverController> = {
        dismiss: jest.fn()
    };

    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {
        generateInteractTelemetry: jest.fn(),
        generateImpressionTelemetry: jest.fn()
    };

    const mockNavParams: Partial<NavParams> = {
        get: jest.fn((arg) => {
            let value;
            switch (arg) {
                case 'upgrade':
                    value = {
                        type: 'force',
                        optional: 'forceful',
                        title: 'We recommend that you upgrade to the latest version of Sunbird.',
                        desc: '',
                        actionButtons: [
                            {
                                action: 'yes',
                                label: 'Update Now',
                                link: 'https://play.google.com/store/apps/details?id=org.sunbird.app&hl=en'
                            },
                            {
                                action: 'no',
                                label: 'Cancel'
                            },
                            {
                                action: 'xyz',
                                label: 'Cancel'
                            }
                        ],
                        minVersionCode: 13,
                        maxVersionCode: 52,
                        currentAppVersionCode: 23
                    };
                    break;
            }
            return value;
        })
    };

    beforeAll(() => {
        upgradePopoverComponent = new UpgradePopoverComponent(
            mockUtilityService as UtilityService,
            mockPopOverController as PopoverController,
            mockNavParams as NavParams,
            mockTelemetryGeneratorService as TelemetryGeneratorService,
            mockAppVersion as AppVersion
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a instance of UpgradePopoverComponent', () => {
        expect(upgradePopoverComponent).toBeTruthy();
    });

    it('should close popover', () => {
        // arrange
        // act
        upgradePopoverComponent.cancel();
        // assert
        expect(mockPopOverController.dismiss).toHaveBeenCalled();
    });

    it('should invoke openPlayStore', () => {
        // arrange
        jest.spyOn(upgradePopoverComponent, 'cancel');
        // act
        upgradePopoverComponent.upgradeApp('https://play.google.com/store/apps/details?id=org.sunbird.app');
        // assert
        expect(mockUtilityService.openPlayStore).toHaveBeenCalledWith('org.sunbird.app');
        expect(upgradePopoverComponent.cancel).toHaveBeenCalled();
    });

    it('should generate impression and interact when popoup shows', (done) => {
        // arrange
        mockTelemetryGeneratorService.generateImpressionTelemetry = jest.fn();
        mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
        // act
        upgradePopoverComponent.init();
        // assert
        setTimeout(() => {
            expect(mockTelemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(
                ImpressionType.VIEW,
                ImpressionSubtype.UPGRADE_POPUP,
                PageId.UPGRADE_POPUP,
                Environment.HOME
            );
            expect(mockTelemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.OTHER,
                InteractSubtype.FORCE_UPGRADE_INFO,
                Environment.HOME,
                PageId.UPGRADE_POPUP,
                undefined,
                {
                    minVersionCode: 13,
                    maxVersionCode: 52,
                    currentAppVersionCode: 23
                }
            );
            done();
        }, 0);
    });

});


describe('UpgradePopoverComponent', () => {
    let upgradePopoverComponent: UpgradePopoverComponent;
    const mockUtilityService: Partial<UtilityService> = {
        openPlayStore: jest.fn()
    };
    const mockAppVersion: Partial<AppVersion> = {
        getAppName: jest.fn(() => Promise.resolve('some_string'))
    };
    const mockPopOverController: Partial<PopoverController> = {
        dismiss: jest.fn()
    };

    const mockTelemetryGeneratorService: Partial<TelemetryGeneratorService> = {
        generateInteractTelemetry: jest.fn(),
        generateImpressionTelemetry: jest.fn()
    };

    const mockNavParams: Partial<NavParams> = {
        get: jest.fn((arg) => {
            let value;
            switch (arg) {
                case 'upgrade':
                    value = {
                        type: 'optional',
                        title: 'We recommend that you upgrade to the latest version of Sunbird.',
                        desc: '',
                        minVersionCode: 13,
                        maxVersionCode: 52,
                        currentAppVersionCode: 23
                    };
                    break;
            }
            return value;
        })
    };

    beforeAll(() => {
        upgradePopoverComponent = new UpgradePopoverComponent(
            mockUtilityService as UtilityService,
            mockPopOverController as PopoverController,
            mockNavParams as NavParams,
            mockTelemetryGeneratorService as TelemetryGeneratorService,
            mockAppVersion as AppVersion
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('isMandatoryUpgrade should be false when popoup shows', (done) => {
        // arrange
        mockTelemetryGeneratorService.generateImpressionTelemetry = jest.fn();
        mockTelemetryGeneratorService.generateInteractTelemetry = jest.fn();
        // act
        upgradePopoverComponent.init();
        // assert
        setTimeout(() => {
            expect(upgradePopoverComponent.isMandatoryUpgrade).toBeFalsy();
            done();
        }, 0);
    });

});
