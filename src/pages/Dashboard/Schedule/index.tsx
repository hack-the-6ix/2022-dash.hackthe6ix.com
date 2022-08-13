import Calendar from "../../../components/Calendar";

function Schedule() {
  return (
    <div className={''}>
      <Calendar
        schedule={[
          {
            start: new Date('2022-09-05 12:00'),
            end: new Date('2022-09-05 13:00'),
            category: 'owo',
          },
          {
            start: new Date('2022-09-05 13:00'),
            end: new Date('2022-09-05 14:00'),
            category: 'owo',
          },
        ]}
        categories={[
          {
            ref: 'owo',
            label: 'OwO Label',
            color: '#00cbfa',
          },
          {
            ref: 'uwu',
            label: 'UwU Label',
            color: '#48ec5d',
          },
        ]}
      />
    </div>
  );
}

export default Schedule;
