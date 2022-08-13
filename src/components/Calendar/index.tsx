import { CSSProperties, Fragment, HTMLProps, useMemo } from "react";
import { Typography } from "@ht6/react-ui";
import cx from 'classnames';
import { repeat, applyPosition, formatDate, serializeDate } from './utils';
import styles from './Calendar.module.scss';

type Category<Categories extends string = string> = {
  color: `#${string}`;
  ref: Categories;
  label: string;
}

type ScheduleData<Categories extends string = string> = {
  category: Categories;
  start: Date;
  end: Date;
}

export interface CalendarProps<Categories extends string = string> extends HTMLProps<HTMLDivElement> {
  schedule: ScheduleData<Categories>[];
  categories: Category<Categories>[];
  timezone?: string;
  locale?: string;
}
function Calendar<Categories extends string>({
  timezone = 'America/Toronto',
  locale = 'en',
  categories,
  schedule,
  ...props
}: CalendarProps<Categories>) {
  const scheduleByDay = useMemo(() => {
    return schedule.reduce<{ [date: string]: ScheduleData<Categories>[] }>(
      (acc, item) => {
        const day = serializeDate(item.start);
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
      },
      {},
    );
  }, [ schedule ]);
  const days = Object.keys(scheduleByDay);
  const cols = days.length * 24;
  const rows = categories.length;

  return (
    <div
      {...props}
      style={{ ...props.style, '--cols': cols, '--rows': rows } as CSSProperties}
      className={cx(props.className, styles.root)}
    >
      {categories.map((category, idx) => (
        <div
          style={{ ...applyPosition(1, (idx * 2) + 3), '--a': category.color } as CSSProperties}
          className={styles.label}
          key={category.ref}
        >
          <div className={styles.accent}/>
          <Typography textType='heading4' textColor='primary-3'>
            {category.label}
          </Typography>
        </div>
      ))}
      {days.map((day, idx) => {
        const offset = (idx * 24 * 2) + 3;
        return (
          <Fragment key={day}>
            <Typography
              style={applyPosition(offset, 1, 3, 1)}
              className={styles.day}
              textColor='primary-3'
              textType='heading4'
            >
              {formatDate(locale, timezone, new Date(day))}
            </Typography>
            {repeat(24, jdx => (
              <Typography
                style={applyPosition(offset + (jdx * 2), 2)}
                className={styles.hour}
                textColor='primary-3'
                textType='paragraph1'
                key={jdx}
              >
                {jdx % 12 || 12}:00{jdx > 12 ? 'pm' : 'am'}
              </Typography>
            ))}
          </Fragment>
        );
      })}
      <div style={applyPosition(1, 1, 1, 2)} className={styles.cover}/>
      {repeat(cols + 2, (idx) => (
        <div
          style={applyPosition((idx + 1) * 2, idx % 24 ? 2 : 1, 1, rows * 2 + 2)}
          className={cx(styles.line, styles.vline, !idx && styles.fixed)}
          key={idx}
        />
      ))}
      {repeat(rows + 1, (idx) => (
        <div
          style={applyPosition(1, (idx * 2) + 3, cols * 2 + 1, 1)}
          className={cx(styles.line, styles.hline)}
          key={idx}
        />
      ))}
    </div>
  );
}

export default Calendar;