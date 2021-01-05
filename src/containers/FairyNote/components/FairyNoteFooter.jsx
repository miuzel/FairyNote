import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { saveList, timelineSave } from "../../../redux/actions";
import { useTranslation } from 'react-i18next';


const FairyNoteFooter = props => {
  const { t } = useTranslation()
  const [ autoSaveTimer, setAutoSaveTimer ] = useState(null);
  const [ saving, setSaving ] = useState(0);
  const { autoSave, changed, timelineSave } = props;

  useEffect(() => {
    const timer =  () => {
      setSaving(1);
      setTimeout(()=> {
          timelineSave({ quiet: true })
          saveList()
      },0);
    }
    const stopTimer = () => {
      clearInterval(autoSaveTimer);
      setSaving(0);
      setAutoSaveTimer(null);
    }
    if (autoSave) {
      if (!autoSaveTimer) {
        console.log("set up autosave");
        setAutoSaveTimer(setInterval(timer, 1000));
      }
    } else {
      if (autoSaveTimer) {
        console.log("cancel autosave");
        stopTimer();
      }
    }
    if (saving && !changed) {
      setSaving(0);
    }
    
  }, [autoSave, saving, changed, timelineSave, autoSaveTimer]);

  return (
    <div id="extensionfooter">
      © 2019 FairyNote --VERSION--{" "}
      {!autoSave
        ? changed
            ? t("changed")
            : ""
        : changed
            ? saving
            ? t("saving")
            : t("pendsaving")
            : ""}
    </div>
  );
};


const mapStateToProps = (state) => ({
    autoSave: state.settings.autoSave,
    changed: state.timeline.changed
})

const mapDispatchToProps = {
    timelineSave,saveList
}

export default connect(mapStateToProps, mapDispatchToProps)(FairyNoteFooter)
