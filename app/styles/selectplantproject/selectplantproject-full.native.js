import EStyleSheet from 'react-native-extended-stylesheet';

export default (selectplantprojectFull = EStyleSheet.create({
  projectFullContainer: {
    flex: 1,
    padding: 10
  },
  projectTeaserContainer: {
    height: 250
  },
  projectSpecsContainer: {
    height: 180
  },
  select_different_project_style: {
    marginLeft: 20,
    alignSelf: 'center'
  },
  select_different_project_style_text: {
    color: '#ec6453',
    fontSize: 13,
    textAlign: 'center'
  },
  seeMoreContainer: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    height: 50
  },
  plantProjectDetails: {
    flexGrow: 1
  }
}));
