import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';

type CardProps = {
  title: string;
  stat: string;
};

const Section = ({
  title,
  metrics,
}: {
  title: string;
  metrics: Array<CardProps>;
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.section}>
        {metrics.map((metric) => (
          <Card title={metric.title} stat={metric.stat} key={metric.title} />
        ))}
      </View>
    </View>
  );
};

const Card = ({ title, stat }: CardProps) => (
  <View style={styles.card}>
    <Text style={styles.cardStat}>{stat}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
  </View>
);

export default Section;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    gap: 10,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 20,
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    gap: 10,
    height: 200,
  },

  card: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    width: '31%',
    height: 70,

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  cardStat: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardTitle: {
    fontWeight: '200',
  },
});
