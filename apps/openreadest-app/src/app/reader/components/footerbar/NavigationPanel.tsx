import clsx from 'clsx';
import React, { useCallback, useEffect } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { RiArrowGoBackLine, RiArrowGoForwardLine } from 'react-icons/ri';
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from 'react-icons/ri';
import { getNavigationIcon, getNavigationLabel, getNavigationHandler } from './utils';
import { useEnv } from '@/context/EnvContext';
import { useReaderStore } from '@/store/readerStore';
import { useTranslation } from '@/hooks/useTranslation';
import { ViewSettings } from '@/types/book';
import { NavigationHandlers } from './types';
import Button from '@/components/Button';
import Slider from '@/components/Slider';

interface NavigationPanelProps {
  bookKey: string;
  actionTab: string;
  progressFraction: number;
  progressValid: boolean;
  navigationHandlers: NavigationHandlers;
  viewSettings?: ViewSettings;
  bottomOffset: string;
  sliderHeight: number;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  bookKey,
  actionTab,
  progressFraction,
  progressValid,
  navigationHandlers,
  viewSettings,
  bottomOffset,
  sliderHeight,
}) => {
  const _ = useTranslation();
  const { appService } = useEnv();
  const { getView, getProgress } = useReaderStore();
  const view = getView(bookKey);
  const progress = getProgress(bookKey);
  const { sectionLabel } = progress || {};

  const [progressValue, setProgressValue] = React.useState(
    progressValid ? progressFraction * 100 : 0,
  );

  useEffect(() => {
    if (progressValid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgressValue(progressFraction * 100);
    }
  }, [progressValid, progressFraction]);

  const handleProgressChange = useCallback(
    (value: number) => {
      setProgressValue(value);
      navigationHandlers.onProgressChange(value);
    },
    [navigationHandlers],
  );

  const classes = clsx(
    'footerbar-progress-mobile not-eink:bg-base-200 eink:bg-base-100 absolute flex w-full flex-col items-center gap-y-8 px-4 transition-all sm:hidden',
    'eink:border-base-content eink:border-t',
    actionTab === 'progress'
      ? 'pointer-events-auto translate-y-0 pb-4 pt-8 ease-out'
      : 'pointer-events-none invisible translate-y-full overflow-hidden pb-0 pt-0 ease-in',
  );

  return (
    <div
      className={classes}
      style={{
        bottom: appService?.isAndroidApp
          ? `calc(env(safe-area-inset-bottom) + 64px)`
          : bottomOffset,
      }}
    >
      {/* WeChat Read Chapter info above slider */}
      {sectionLabel && (
        <div className='flex w-full items-center justify-between text-xs text-base-content/80 px-1'>
          <span className='truncate font-medium max-w-[70%]' title={sectionLabel}>
            {sectionLabel}
          </span>
          <span className='shrink-0 font-medium tracking-wider'>{Math.round(progressValue)}%</span>
        </div>
      )}
      <div className='flex w-full items-center justify-between gap-x-3'>
        <Button
          icon={getNavigationIcon(
            viewSettings?.rtl,
            <RiArrowLeftDoubleLine />,
            <RiArrowRightDoubleLine />,
          )}
          onClick={getNavigationHandler(
            viewSettings?.rtl,
            navigationHandlers.onPrevSection,
            navigationHandlers.onNextSection,
          )}
          label={getNavigationLabel(viewSettings?.rtl, _('Previous Section'), _('Next Section'))}
        />
        <div className='flex-1 min-w-0'>
          <Slider
            label={_('Reading Progress')}
            heightPx={sliderHeight}
            bubbleLabel={`${Math.round(progressValue)}%`}
            initialValue={progressValue}
            onChange={handleProgressChange}
          />
        </div>
        <Button
          icon={getNavigationIcon(
            viewSettings?.rtl,
            <RiArrowRightDoubleLine />,
            <RiArrowLeftDoubleLine />,
          )}
          onClick={getNavigationHandler(
            viewSettings?.rtl,
            navigationHandlers.onNextSection,
            navigationHandlers.onPrevSection,
          )}
          label={getNavigationLabel(viewSettings?.rtl, _('Next Section'), _('Previous Section'))}
        />
      </div>
      <div className='flex w-full items-center justify-between gap-x-6'>
        <Button
          icon={getNavigationIcon(
            viewSettings?.rtl,
            <RiArrowLeftDoubleLine />,
            <RiArrowRightDoubleLine />,
          )}
          onClick={getNavigationHandler(
            viewSettings?.rtl,
            navigationHandlers.onPrevSection,
            navigationHandlers.onNextSection,
          )}
          label={getNavigationLabel(viewSettings?.rtl, _('Previous Section'), _('Next Section'))}
        />
        <Button
          icon={getNavigationIcon(viewSettings?.rtl, <RiArrowLeftSLine />, <RiArrowRightSLine />)}
          onClick={getNavigationHandler(
            viewSettings?.rtl,
            navigationHandlers.onPrevPage,
            navigationHandlers.onNextPage,
          )}
          label={getNavigationLabel(viewSettings?.rtl, _('Previous Page'), _('Next Page'))}
        />
        <Button
          icon={getNavigationIcon(
            viewSettings?.rtl,
            <RiArrowGoBackLine />,
            <RiArrowGoForwardLine />,
          )}
          onClick={navigationHandlers.onGoBack}
          label={_('Go Back')}
          disabled={!view?.history.canGoBack}
        />
        <Button
          icon={getNavigationIcon(
            viewSettings?.rtl,
            <RiArrowGoForwardLine />,
            <RiArrowGoBackLine />,
          )}
          onClick={navigationHandlers.onGoForward}
          label={_('Go Forward')}
          disabled={!view?.history.canGoForward}
        />
        <Button
          icon={getNavigationIcon(viewSettings?.rtl, <RiArrowRightSLine />, <RiArrowLeftSLine />)}
          onClick={getNavigationHandler(
            viewSettings?.rtl,
            navigationHandlers.onNextPage,
            navigationHandlers.onPrevPage,
          )}
          label={getNavigationLabel(viewSettings?.rtl, _('Next Page'), _('Previous Page'))}
        />
        <Button
          icon={getNavigationIcon(
            viewSettings?.rtl,
            <RiArrowRightDoubleLine />,
            <RiArrowLeftDoubleLine />,
          )}
          onClick={getNavigationHandler(
            viewSettings?.rtl,
            navigationHandlers.onNextSection,
            navigationHandlers.onPrevSection,
          )}
          label={getNavigationLabel(viewSettings?.rtl, _('Next Section'), _('Previous Section'))}
        />
      </div>
    </div>
  );
};
