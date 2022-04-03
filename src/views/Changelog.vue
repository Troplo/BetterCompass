<template>
  <div>
    <v-container>
      <v-card color="card" class="rounded-xl" elevation="7">
        <v-toolbar color="toolbar">
          <v-toolbar-title>BetterCompass Changelog</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-card-title> 02/04/2022 - 03/04/2022</v-card-title>
          <ul>
            <li>BetterCompass is now <a href="https://github.com/Troplo/BetterCompass"> open source</a>, licensed under GNU General Public License V3.</li>
            <li>Progress Reports now has a chart that corresponds to the selected cycle (BetterCompass Exclusive).</li>
            <li>Due date is now shown on the learning tasks table.</li>
            <li>Subject and Activity is now shown on the User Profile Learning Tasks table. (Now sorted by activity by default)</li>
            <li>You can now see your class attendance record per class on the Attendance tab.</li>
            <li>You can now view child profiles, and your personal user profile with a Parent account.</li>
            <li>Reports, Attendance, etc now correspond to the child profile.</li>
            <li>Updated profile route scheme to /user/:id/:tab from /user/:tab.</li>
            <li>User Flags are now shown as red banners on the User Profile (Parent only).</li>
            <li>Clicking on the learning task notification warning will take you to Learning Tasks.</li>
            <li>Fixed bug where the Learning Task description would always be null on the User Profile Learning Tasks.</li>
            <li>Fixed login validation error.</li>
            <li>Fixed & Improved Calendar AutoJump.</li>
            <li>You can now submit URL links in Learning Tasks.</li>
            <li>You can now see your per term attendance.</li>
            <li>The BetterCompass gradient will appear again on the title if there is no set accent color.</li>
          </ul>

          <v-card-title> 30/03/2022 </v-card-title>
          <ul>
            <li>An alternate domain, bettercompass.com.au can be used to access BetterCompass if you wish.</li>
            <li>Compass-compatible Activity Discussions will not be added to BetterCompass.</li>
            <li>Attendance calendar has been added to Your Profile.</li>
            <li>Performance & Bug fixes.</li>
          </ul>

          <v-card-title> 29/03/2022 </v-card-title>
          <ul>
            <li>
              You can now see Analytics in your profile.
            </li>
            <li>
              You can now see your true score for Learning Tasks. (eg. Excellent (8/8))
            </li>
            <li>
              Fixed bug where you couldn't see progress reports.
            </li>
            <li>
              Fixed double-loading calendar bug.
            </li>
            <li>
              Fixed missing loading spinner on page initialization.
            </li>
          </ul>

          <v-card-title> 28/03/2022 </v-card-title>
          <ul>
            <li>
              There is a new guided setup wizard for new BetterCompass users.
            </li>
            <li>
              The calendar day persists if you were to go back to Home after
              navigating away.
            </li>
            <li>Progress Reports have been added.</li>
            <li>The calendar now has columns for overlapping events.</li>
            <li>
              The minimize calendar events feature now permits blue events.
            </li>
            <li>
              The QuickSwitcher now has the subject short-code (eg. Year 11
              Computing (11COM11))
            </li>
            <li>You can use existing theme presets to create a new theme.</li>
            <li>The attendance now registers "Late Un'd" as Late.</li>
            <li>You can now randomize a theme with the theme creator.</li>
          </ul>

          <v-card-title> 25/03/2022 - 27/03/2022 </v-card-title>
          <ul>
            <li>
              Themes, there are now a few theme presets to choose from, some
              include Classic, Grey, and AMOLED (Dark)
            </li>
            <li>
              You can now make your own themes by changing the defined colors to
              your liking
            </li>
            <li>
              You can now choose the accent/primary color of your choosing
              without creating an entire new theme.
            </li>
            <li>
              Themes will synchronize throughout all devices, including your
              preferred theme.
            </li>
            <li>
              Calendar Auto Jumping, the calendar will now skip to Monday if on
              a weekend (can be disabled in Settings).
            </li>
            <li>Significantly reduced bundle size.</li>
            <li>
              Settings now has its own dedicated page as a User Profile tab.
            </li>
            <li>
              All ugly styles are removed from lesson plans, including in
              Resources.
            </li>
            <li>
              The calendar is now much faster by preloading a week before, and
              in advance which will defeat the need for loading.
            </li>
            <li>
              There is now a banner shown when there is a BetterCompass update
              available.
            </li>
            <li>Settings now synchronize throughout all devices.</li>
          </ul>

          <v-card-title> 24/03/2022 </v-card-title>
          <ul>
            <li>
              Fixed major issue where the main thread would freeze from 4
              seconds to crashing the entire browser when loading BetterCompass.
              More details can be found on
              <a href="https://github.com/vuetifyjs/vuetify/issues/14864">
                this issue</a
              >.
            </li>
            <li>You can now press ENTER to submit the login form.</li>
            <li>
              Relief/substitute teachers no longer show unparsed HTML code on
              the calendar.
            </li>
          </ul>

          <v-card-title> 23/03/2022 </v-card-title>
          <ul>
            <li>
              Tasks, you can now, create, view, and edit normal Compass tasks.
            </li>
            <li>
              Rich Notes, rich notes are an enhanced version of standard tasks
              that allow you to add descriptions, they cannot be viewed in
              normal Compass.
            </li>
            <li>
              Class Notes, using rich notes, you can now create notes that are
              specific to a class.
            </li>
            <li>You can now see your upcoming events on the dashboard.</li>
            <li>
              You can now minimize header activities to only show learning tasks
              and your current school week (if your school supports it), enable
              in BetterCompass Settings.
            </li>
            <li>
              Removed redundant day text and button from calendar on the daily
              schedule mode.
            </li>
            <li>You can now download attachments from School News.</li>
            <li>
              Lesson plans are now sanitized to avoid XSS (albeit an extremely
              unlikely occurrence), and other uglifying styles.
            </li>
          </ul>

          <v-card-title> 22/03/2022 </v-card-title>
          <ul>
            <li>Added activity resources.</li>
            <li>Added school resources.</li>
            <li>Fixed weather widget.</li>
            <li>Updated dark theme color scheme.</li>
            <li>Made light theme slightly more tolerable.</li>
            <li>
              Added "Provide Feedback" button on the sidebar to report
              bugs/suggest features.
            </li>
            <li>Added school events.</li>
            <li>Removed parent options on User Profile page.</li>
            <li>Added semester reports.</li>
            <li>Remove unparsed JSON from chronicle.</li>
            <li>
              Added actual routes to QuickSwitch, like User Profile, in addition
              to the existing subjects.
            </li>
          </ul>

          <v-card-title> 21/03/2022 </v-card-title>
          <ul>
            <li>Fixed the dark sidebar on light theme.</li>
            <li>Removed white border around calendar.</li>
            <li>Added calendar refresh button (which also jumps to today).</li>
            <li>Added feedback tab to learning tasks.</li>
            <li>
              Compass links in learning tasks will be replaced with
              BetterCompass equivalents.
            </li>
            <li>Weekly schedule will exclude weekends.</li>
            <li>
              "Your Profile" now won't crash if you load it as the initial
              route.
            </li>
            <li>
              Learning task uploader now properly supports 2 or more upload
              types.
            </li>
            <li>Extra chronicle info has been moved to a dialog.</li>
            <li>The QuickSwitcher now clears the input automatically.</li>
            <li>
              The PWA app has been modified so the title-bar matches the
              background.
            </li>
            <li>The calendar now recognizes substitute teacher classes.</li>
            <li>You can now see what teacher you have on the activity.</li>
            <li>
              The activity instance will now automatically set itself upon
              QuickSwitch.
            </li>
            <li>
              You can now easily change between activity instances with arrows.
            </li>
            <li>
              There is now a weather widget built into BetterCompass. (Can be
              disabled in BetterCompass Settings)
            </li>
          </ul>
          <small
            >BetterCompass version {{ $store.state.versioning.version }}, built
            on {{ $store.state.versioning.date }}</small
          >
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Changelog"
}
</script>

<style scoped></style>
