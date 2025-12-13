# Heuristic Evaluation

## The 10 Principles

1. Visibility of system status
Give more of an indication that calendar player can't be used, esp the play btns (same with START btn); pretty good in terms of saving though

2. Match between system and the real world
Pretty good, like icons tell u what they should do, but it's not super clear in the calendar player. Need placeholder text otherwise don't know how to start calendar player. Calendar works like a calendar.

3. User control & freedom
Good; cancel btn undos unsaved changes

4. Consistency & Standard
The btns' implied uses are consistent with the standard; ex: the play button plays music and music keeps playing when the prev song ends = standard music playing. Calendar works like a calendar.

5. Error prevention
Spotify API covered spelling errors when querying for song search. 

6. Recognition rather than recall
Have placeholder sometimes for inputs + btns for the calendar player

7. Flexibility & efficiency of use
Not really present; should be able to customize like for names & customize journals names 

8. Aesthetic & minimalist design
Like the minimalist design but needs a bit more clarification on how some stuff work; design is aesthetic; simple and each page's design makes sense for the context = calendar/music/diary

9. Help users recognize & recover from errors
Is done in the saving work aspect

10. Help & documentation
Should have some documentation b/c the calendar player is rlly confusing to use; everything else might as well have its own documentation too at that point; should label the calendar player either on the documentation pg or website itself. Make sure to have an initial page with a diagram of the website with labels of what everything is and with brief descriptions of each so users know what available features there are before using the website. 


## Future Features

- Be able to set the volume before playing (calendar player)
- Put in text for the month (placeholder text); make it more obvious where the month picker is for the calendar player
- Mute volume when clicking on the volume icon would be nice
- Should cache the search results and query when pressing "Change Song" after selecting a song in the entry player
- Differentiate btwn entries in the My Entries tab, maybe by letting user be able to set a name for an entry b/c in the My Entries tab, it only shows the date and entry #
- Overall, the calendar player being grayed out/blank is not a good indication that it can't be used; it needs to be more obvious how to start the thing
- Calendar player didn't update when preloaded with prev state of month's song but songs get updated, then month's songs are played again via the play btn, not the START btn (makes sense b/c the START btn requeues the month's songs, not the play btn but might want to fix that somehow)
- Allow for more customization 
- Create a documentation page to highlight all features of the website and to explain how each works, especially the more complicated features like the calendar player
- Associate month's song by both month AND YEAR (bug to fix: add song in Dec 2025, play calendar month Dec 2026 in the calendar player and it'll play w/ that song)