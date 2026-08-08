import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { CheckInChart } from '@/features/check-ins/components/check-in-chart';
import { CheckInForm } from '@/features/check-ins/components/check-in-form';
import { CheckInHistory } from '@/features/check-ins/components/check-in-history';
import { CheckInProgressSummary } from '@/features/check-ins/components/check-in-progress-summary';
import { useCheckInsScreen } from '@/features/check-ins/hooks/use-check-ins-screen.hooks';
import { useTranslate } from '@/hooks/use-translate';

export function CheckInsScreen() {
  const { t } = useTranslate();
  const state = useCheckInsScreen();

  if (state.status === 'loading') {
    return (
      <div role="status" className="flex min-h-[50vh] items-center justify-center">
        {t('common.loading')}
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <ErrorState
          title={t('checkIns.error.title')}
          description={t('checkIns.error.description')}
          retryLabel={t('checkIns.error.retry')}
          onRetry={state.onRetry}
        />
      </div>
    );
  }

  const { isEmpty, checkIns, profile, form } = state;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <CheckInForm
        title={t('checkIns.form.title')}
        tip={t('checkIns.form.tip')}
        dateLabel={t('checkIns.form.dateLabel')}
        weightLabel={t('checkIns.form.weightLabel')}
        waistLabel={t('checkIns.form.waistLabel')}
        notesLabel={t('checkIns.form.notesLabel')}
        notesPlaceholder={t('checkIns.form.notesPlaceholder')}
        submitLabel={t('checkIns.form.submit')}
        submitPendingLabel={t('checkIns.form.submitPending')}
        date={form.date}
        weightKg={form.weightKg}
        waistCm={form.waistCm}
        notes={form.notes}
        onDateChange={form.onDateChange}
        onWeightKgChange={form.onWeightKgChange}
        onWaistCmChange={form.onWaistCmChange}
        onNotesChange={form.onNotesChange}
        onSubmit={form.onSubmit}
        isSubmitting={form.isSubmitting}
        dateError={form.dateError}
        weightKgError={form.weightKgError}
        waistCmError={form.waistCmError}
        formError={form.formError}
      />

      {isEmpty ? (
        <EmptyState
          title={t('checkIns.empty.title')}
          description={t('checkIns.empty.description')}
        />
      ) : (
        <>
          <CheckInProgressSummary
            title={t('checkIns.goals.title')}
            totalLostTitle={t('checkIns.stats.totalLostTitle')}
            averagePaceTitle={t('checkIns.stats.averagePaceTitle')}
            averagePaceUnit={t('checkIns.stats.averagePaceUnit')}
            notEnoughDataLabel={t('checkIns.stats.notEnoughData')}
            comfortableLabel={t('checkIns.goals.comfortable')}
            capLabel={t('checkIns.goals.cap')}
            overweightExitLabel={t('checkIns.goals.overweightExit')}
            progressLabel={t('checkIns.goals.progressLabel')}
            novemberBannerText={t('checkIns.goals.novemberBanner')}
            totalLostKg={state.totalLostKg}
            averagePaceKgPerWeek={state.averagePaceKgPerWeek}
            goalNovemberComfortableKg={profile.goalNovemberComfortableKg}
            goalCapKg={profile.goalCapKg}
            goalOverweightExitKg={profile.goalOverweightExitKg}
            goalProgressPercentage={state.goalProgressPercentage}
            isInsideNovemberWindow={state.isInsideNovemberWindow}
          />

          <CheckInChart
            checkIns={checkIns}
            weightTitle={t('checkIns.chart.weightTitle')}
            waistTitle={t('checkIns.chart.waistTitle')}
            weightLabel={t('checkIns.chart.weightLabel')}
            waistLabel={t('checkIns.chart.waistLabel')}
            comfortableLabel={t('checkIns.goals.comfortable')}
            capLabel={t('checkIns.goals.cap')}
            overweightExitLabel={t('checkIns.goals.overweightExit')}
            goalNovemberComfortableKg={profile.goalNovemberComfortableKg}
            goalCapKg={profile.goalCapKg}
            goalOverweightExitKg={profile.goalOverweightExitKg}
          />

          <CheckInHistory
            title={t('checkIns.history.title')}
            dateColumnLabel={t('checkIns.history.dateColumn')}
            weightColumnLabel={t('checkIns.history.weightColumn')}
            waistColumnLabel={t('checkIns.history.waistColumn')}
            deltaColumnLabel={t('checkIns.history.deltaColumn')}
            notesColumnLabel={t('checkIns.history.notesColumn')}
            checkIns={checkIns}
          />
        </>
      )}
    </div>
  );
}
