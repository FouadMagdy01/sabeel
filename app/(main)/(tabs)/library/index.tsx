import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Button } from '@/common/components/Button';
import { Input } from '@/common/components/Input';
import Icon from '@/common/components/Icon/icon';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');

  const handlePress = () => {
    Alert.alert('Button Pressed');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('screens.library.title')}</Text>

        {/* Contained Buttons */}
        <Text style={styles.sectionTitle}>Contained Buttons</Text>
        <View style={styles.row}>
          <Button onPress={handlePress}>Primary</Button>
          <Button color="secondary" onPress={handlePress}>Secondary</Button>
        </View>

        {/* Outlined Buttons */}
        <Text style={styles.sectionTitle}>Outlined Buttons</Text>
        <View style={styles.row}>
          <Button variant="outlined" onPress={handlePress}>Primary</Button>
          <Button variant="outlined" color="secondary" onPress={handlePress}>Secondary</Button>
        </View>

        {/* Elevated Buttons */}
        <Text style={styles.sectionTitle}>Elevated Buttons</Text>
        <View style={styles.row}>
          <Button variant="elevated" onPress={handlePress}>Primary</Button>
          <Button variant="elevated" color="secondary" onPress={handlePress}>Secondary</Button>
        </View>

        {/* Text Buttons */}
        <Text style={styles.sectionTitle}>Text Buttons</Text>
        <View style={styles.row}>
          <Button variant="text" onPress={handlePress}>Primary</Button>
          <Button variant="text" color="secondary" onPress={handlePress}>Secondary</Button>
        </View>

        {/* Buttons with Icons */}
        <Text style={styles.sectionTitle}>Buttons with Icons (Left)</Text>
        <View style={styles.row}>
          <Button
            icon={<Icon familyName="Feather" iconName="check" variant="inverse" size={16} />}
            onPress={handlePress}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            icon={<Icon familyName="Feather" iconName="plus" variant="accent" size={16} />}
            onPress={handlePress}
          >
            Add
          </Button>
          <Button
            variant="elevated"
            icon={<Icon familyName="Feather" iconName="save" variant="primary" size={16} />}
            onPress={handlePress}
          >
            Save
          </Button>
        </View>

        {/* Buttons with Icons (Right) */}
        <Text style={styles.sectionTitle}>Buttons with Icons (Right)</Text>
        <View style={styles.row}>
          <Button
            icon={<Icon familyName="Feather" iconName="arrow-right" variant="inverse" size={16} />}
            iconPosition="right"
            onPress={handlePress}
          >
            Next
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            icon={<Icon familyName="Feather" iconName="external-link" color="#0FA18F" size={16} />}
            iconPosition="right"
            onPress={handlePress}
          >
            Open
          </Button>
          <Button
            variant="text"
            icon={<Icon familyName="Feather" iconName="chevron-right" variant="accent" size={16} />}
            iconPosition="right"
            onPress={handlePress}
          >
            More
          </Button>
        </View>

        {/* Icon Only Style Buttons */}
        <Text style={styles.sectionTitle}>Icon Buttons (Various Sizes)</Text>
        <View style={styles.row}>
          <Button
            size="small"
            icon={<Icon familyName="Feather" iconName="heart" variant="inverse" size={12} />}
            onPress={handlePress}
          >
            Like
          </Button>
          <Button
            size="medium"
            icon={<Icon familyName="Feather" iconName="share-2" variant="inverse" size={14} />}
            onPress={handlePress}
          >
            Share
          </Button>
          <Button
            size="large"
            icon={<Icon familyName="Feather" iconName="download" variant="inverse" size={18} />}
            onPress={handlePress}
          >
            Download
          </Button>
        </View>

        {/* Sizes */}
        <Text style={styles.sectionTitle}>Sizes</Text>
        <View style={styles.row}>
          <Button size="small" onPress={handlePress}>Small</Button>
          <Button size="medium" onPress={handlePress}>Medium</Button>
          <Button size="large" onPress={handlePress}>Large</Button>
        </View>

        {/* Outlined Sizes */}
        <Text style={styles.sectionTitle}>Outlined Sizes</Text>
        <View style={styles.row}>
          <Button variant="outlined" size="small" onPress={handlePress}>Small</Button>
          <Button variant="outlined" size="medium" onPress={handlePress}>Medium</Button>
          <Button variant="outlined" size="large" onPress={handlePress}>Large</Button>
        </View>

        {/* Loading States */}
        <Text style={styles.sectionTitle}>Loading States</Text>
        <View style={styles.row}>
          <Button loading onPress={handlePress}>Contained</Button>
          <Button variant="outlined" loading onPress={handlePress}>Outlined</Button>
        </View>
        <View style={styles.row}>
          <Button variant="elevated" loading onPress={handlePress}>Elevated</Button>
          <Button variant="text" loading onPress={handlePress}>Text</Button>
        </View>

        {/* Loading with Colors */}
        <Text style={styles.sectionTitle}>Loading Colors</Text>
        <View style={styles.row}>
          <Button loading onPress={handlePress}>Primary</Button>
          <Button color="secondary" loading onPress={handlePress}>Secondary</Button>
        </View>
        <View style={styles.row}>
          <Button variant="outlined" loading onPress={handlePress}>Primary</Button>
          <Button variant="outlined" color="secondary" loading onPress={handlePress}>Secondary</Button>
        </View>

        {/* Disabled Buttons */}
        <Text style={styles.sectionTitle}>Disabled Buttons</Text>
        <View style={styles.row}>
          <Button disabled onPress={handlePress}>Contained</Button>
          <Button variant="outlined" disabled onPress={handlePress}>Outlined</Button>
        </View>
        <View style={styles.row}>
          <Button variant="elevated" disabled onPress={handlePress}>Elevated</Button>
          <Button variant="text" disabled onPress={handlePress}>Text</Button>
        </View>

        {/* Disabled with Icons */}
        <Text style={styles.sectionTitle}>Disabled with Icons</Text>
        <View style={styles.row}>
          <Button
            disabled
            icon={<Icon familyName="Feather" iconName="lock" variant="muted" size={16} />}
            onPress={handlePress}
          >
            Locked
          </Button>
          <Button
            variant="outlined"
            disabled
            icon={<Icon familyName="Feather" iconName="slash" variant="muted" size={16} />}
            onPress={handlePress}
          >
            Unavailable
          </Button>
        </View>

        {/* All Variants Grid */}
        <Text style={styles.sectionTitle}>All Variants Grid</Text>
        <View style={styles.grid}>
          <View style={styles.gridColumn}>
            <Text style={styles.gridHeader}>Primary</Text>
            <Button size="small" onPress={handlePress}>Contained</Button>
            <Button variant="outlined" size="small" onPress={handlePress}>Outlined</Button>
            <Button variant="elevated" size="small" onPress={handlePress}>Elevated</Button>
            <Button variant="text" size="small" onPress={handlePress}>Text</Button>
          </View>
          <View style={styles.gridColumn}>
            <Text style={styles.gridHeader}>Secondary</Text>
            <Button color="secondary" size="small" onPress={handlePress}>Contained</Button>
            <Button variant="outlined" color="secondary" size="small" onPress={handlePress}>Outlined</Button>
            <Button variant="elevated" color="secondary" size="small" onPress={handlePress}>Elevated</Button>
            <Button variant="text" color="secondary" size="small" onPress={handlePress}>Text</Button>
          </View>
        </View>

        {/* ==================== INPUT COMPONENTS ==================== */}
        <Text style={styles.title}>Input Components</Text>

        {/* Basic Input Variants */}
        <Text style={styles.sectionTitle}>Input Variants</Text>
        <Input
          placeholder="Outlined input (default)"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="filled"
          placeholder="Filled input"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="underlined"
          placeholder="Underlined input"
        />

        {/* Input with Labels */}
        <Text style={styles.sectionTitle}>Inputs with Labels</Text>
        <Input
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="filled"
          label="Username"
          placeholder="Enter username"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="underlined"
          label="Phone"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        {/* Input with Helper Text */}
        <Text style={styles.sectionTitle}>Inputs with Helper Text</Text>
        <Input
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          helperText="Must be at least 8 characters"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="filled"
          label="Bio"
          placeholder="Tell us about yourself"
          helperText="Max 200 characters"
          multiline
        />

        {/* Input Sizes */}
        <Text style={styles.sectionTitle}>Input Sizes</Text>
        <Input
          size="small"
          placeholder="Small input"
        />
        <View style={styles.inputSpacer} />
        <Input
          size="medium"
          placeholder="Medium input (default)"
        />
        <View style={styles.inputSpacer} />
        <Input
          size="large"
          placeholder="Large input"
        />

        {/* Input States */}
        <Text style={styles.sectionTitle}>Input States</Text>
        <Input
          label="Error State"
          placeholder="Enter value"
          error
          errorText="This field is required"
        />
        <View style={styles.inputSpacer} />
        <Input
          label="Success State"
          placeholder="Enter value"
          success
          helperText="Looks good!"
        />
        <View style={styles.inputSpacer} />
        <Input
          label="Disabled State"
          placeholder="Cannot edit"
          disabled
        />

        {/* Input with Left/Right Elements */}
        <Text style={styles.sectionTitle}>Inputs with Icons</Text>
        <Input
          leftElement={<Icon familyName="Feather" iconName="search" variant="tertiary" size={18} />}
          placeholder="Search..."
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="filled"
          leftElement={<Icon familyName="Feather" iconName="mail" variant="tertiary" size={18} />}
          placeholder="Email address"
          keyboardType="email-address"
        />
        <View style={styles.inputSpacer} />
        <Input
          leftElement={<Icon familyName="Feather" iconName="lock" variant="tertiary" size={18} />}
          rightElement={<Icon familyName="Feather" iconName="eye" variant="tertiary" size={18} />}
          placeholder="Password"
          secureTextEntry
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="underlined"
          leftElement={<Icon familyName="Feather" iconName="user" variant="tertiary" size={18} />}
          placeholder="Username"
        />

        {/* All Variants with States */}
        <Text style={styles.sectionTitle}>All Variants with Error</Text>
        <Input
          variant="outlined"
          label="Outlined Error"
          error
          errorText="Invalid input"
          placeholder="Enter value"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="filled"
          label="Filled Error"
          error
          errorText="Invalid input"
          placeholder="Enter value"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="underlined"
          label="Underlined Error"
          error
          errorText="Invalid input"
          placeholder="Enter value"
        />

        {/* Filled Variant Sizes */}
        <Text style={styles.sectionTitle}>Filled Sizes</Text>
        <Input
          variant="filled"
          size="small"
          placeholder="Small filled"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="filled"
          size="medium"
          placeholder="Medium filled"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="filled"
          size="large"
          placeholder="Large filled"
        />

        {/* Underlined Variant Sizes */}
        <Text style={styles.sectionTitle}>Underlined Sizes</Text>
        <Input
          variant="underlined"
          size="small"
          placeholder="Small underlined"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="underlined"
          size="medium"
          placeholder="Medium underlined"
        />
        <View style={styles.inputSpacer} />
        <Input
          variant="underlined"
          size="large"
          placeholder="Large underlined"
        />

        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: theme.metrics.spacing.p16,
    backgroundColor: theme.colors.background.app,
  },
  title: {
    fontSize: theme.fonts.size['2xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.metrics.spacingV.p24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: theme.fonts.size.md,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text.secondary,
    marginTop: theme.metrics.spacingV.p16,
    marginBottom: theme.metrics.spacingV.p8,
  },
  row: {
    flexDirection: 'row',
    gap: theme.metrics.spacing.p8,
    flexWrap: 'wrap',
    marginBottom: theme.metrics.spacingV.p8,
  },
  grid: {
    flexDirection: 'row',
    gap: theme.metrics.spacing.p16,
  },
  gridColumn: {
    flex: 1,
    gap: theme.metrics.spacingV.p8,
    alignItems: 'flex-start',
  },
  gridHeader: {
    fontSize: theme.fonts.size.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text.tertiary,
    marginBottom: theme.metrics.spacingV.p4,
  },
  bottomPadding: {
    height: theme.metrics.spacingV.p32,
  },
  inputSpacer: {
    height: theme.metrics.spacingV.p12,
  },
}));
